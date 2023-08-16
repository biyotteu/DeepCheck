import argparse
import copy
import json
import os
from os.path import join
import sys
import matplotlib.image
from tqdm import tqdm
from PIL import Image

import numpy as np
import torch
import torch.utils.data as data
import torchvision.utils as vutils
import torch.nn.functional as F
from torchvision import transforms
from lib.deepfake_detection.blazeface import FaceExtractor, BlazeFace


sys.path.append("/home/workspace/DeepCheck/deepcheck_backend/lib/watermark") 
from AttGAN.data import check_attribute_conflict



from data import CelebA
import attacks

from model_data_prepare import prepare
from evaluate import evaluate_multiple_models

class Watermark:
    def __init__(self):
        self.args_attack = self.parse()
        self.pgd_attack = self.init_Attack(self.args_attack)

        if self.args_attack.global_settings.universal_perturbation_path:
            self.pgd_attack.up = torch.load(self.args_attack.global_settings.universal_perturbation_path)

        self.attack_dataloader, self.test_dataloader, self.attgan, self.attgan_args, self.solver, self.attentiongan_solver, self.transform, self.F_, self.T, self.G, self.E, self.reference, self.gen_models = prepare()

        self.tf = transforms.Compose([
            transforms.Resize(self.args_attack.global_settings.img_size),
            transforms.CenterCrop(self.args_attack.global_settings.img_size),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),
        ])
        self.tf_toTensor = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),
        ])
        ## face detector
        device = torch.device('cuda:0') if torch.cuda.is_available() else torch.device('cpu')
        facedet = BlazeFace().to(device)
        facedet.load_weights("./lib/deepfake_detection/blazeface/blazeface.pth")
        facedet.load_anchors("./lib/deepfake_detection/blazeface/anchors.npy")
        self.face_extractor = FaceExtractor(facedet=facedet)

    def process(self, img_path, folder_id):
        dir_path = "../tmp/image/"+folder_id+"/"
        out_path = "https://deepcheck.site/tmp/image/"+folder_id+"/"

        origin_image = Image.open(img_path).convert('RGB')
        face_result = self.face_extractor.process_image(img=origin_image)
        faces = face_result['faces']
        detections = face_result['detections']

        face_count = len(faces)
        response = {
            "origin": out_path + img_path.split("/")[-1],
            "watermark":"",
            "faces": []
        }
        if face_count > 0:
            for bbox in detections:
                ymin, xmin, ymax, xmax = list(map(int,bbox[:4]))
                centerx = (xmin + xmax) // 2
                centery = (ymin + ymax) // 2
                width = xmax - xmin
                height = ymax - ymin

                x1 = xmin
                x2 = xmax
                y1 = ymin
                y2 = ymax

                if width > 256:
                    x1 = centerx - 128
                    x2 = centerx + 128

                if height > 256:
                    y1 = centery - 128
                    y2 = centery + 128

                img_np = self.tf_toTensor(origin_image).cuda()
                img_np[:,y1:y2, x1:x2] += self.pgd_attack.up
                vutils.save_image(img_np, os.path.join(dir_path,"watermark.jpg"), nrow=1, normalize=True, range=(-1., 1.))
                response["watermark"] = os.path.join(out_path,"watermark.jpg")

        
            for face_idx in range(len(faces)):
                image = Image.fromarray(faces[face_idx])
                img = image.convert("RGB")
                img = self.tf(img).unsqueeze(0)


                gan_result = {
                    "AttGAN": {
                        "gen":"",
                        "advgen":"",
                    },
                    "StarGAN": {
                        "gen":"",
                        "advgen":"",
                    },
                    "AttentionGAN": {
                        "gen":"",
                        "advgen":"",
                    },
                    "HiSD": {
                        "gen":"",
                        "advgen":"",
                    }
                }
                
                # AttGan
                for idx, (img_a, att_a, c_org) in enumerate(self.test_dataloader):
                    img_a = img.cuda() if self.args_attack.global_settings.gpu else img_a
                    att_a = att_a.cuda() if self.args_attack.global_settings.gpu else att_a
                    att_a = att_a.type(torch.float)   
                    att_b_list = [att_a]
                    
                    for i in range(self.attgan_args.n_attrs):
                        tmp = att_a.clone()
                        tmp[:, i] = 1 - tmp[:, i]
                        tmp = check_attribute_conflict(tmp, self.attgan_args.attrs[i], self.attgan_args.attrs)
                        att_b_list.append(tmp)
                    samples = [img_a, img_a+self.pgd_attack.up]
                    noattack_list = []
                    for i, att_b in enumerate(att_b_list):
                        att_b_ = (att_b * 2 - 1) * self.attgan_args.thres_int
                        if i > 0:
                            att_b_[..., i - 1] = att_b_[..., i - 1] * self.attgan_args.test_int / self.attgan_args.thres_int
                        with torch.no_grad():
                            gen = self.attgan.G(img_a+self.pgd_attack.up, att_b_)
                            gen_noattack = self.attgan.G(img_a, att_b_)
                        samples.append(gen)
                        noattack_list.append(gen_noattack)
                    
                    for j in [len(samples)-3]:#range(len(samples)-2):
                        out_file = os.path.join(dir_path, 'AttGAN_advgen.jpg')
                        # out_file = os.path.join(dir_path, 'AttGAN_advgen_{}.jpg'.format(j))
                        vutils.save_image(samples[j+2], out_file, nrow=1, normalize=True, range=(-1., 1.))

                        out_file = os.path.join(dir_path, 'AttGAN_gen.jpg')
                        # out_file = os.path.join(dir_path, 'AttGAN_gen_{}.jpg'.format(j))
                        vutils.save_image(noattack_list[j], out_file, nrow=1, normalize=True, range=(-1., 1.))
                        gan_result["AttGAN"]["gen"] = os.path.join(out_path, 'AttGAN_gen.jpg')
                        gan_result["AttGAN"]["advgen"] = os.path.join(out_path, 'AttGAN_advgen.jpg')
                    
                    break

                # stargan
                for idx, (img_a, att_a, c_org) in enumerate(self.test_dataloader):
                    img_a = img.cuda() if self.args_attack.global_settings.gpu else img_a
                    att_a = att_a.cuda() if self.args_attack.global_settings.gpu else att_a
                    att_a = att_a.type(torch.float)
                    x_noattack_list, x_fake_list = self.solver.test_universal_model_level(idx, img_a, c_org, self.pgd_attack.up, self.args_attack.stargan)
                    
                    for j in range(len(x_fake_list)):
                        gen_noattack = x_noattack_list[j]
                        gen = x_fake_list[j]
                    
                    for j in [len(x_fake_list)-1]:#range(len(x_fake_list)):
                        gen_noattack = x_noattack_list[j]
                        out_file = os.path.join(dir_path, 'stargan_gen.jpg')
                        # out_file = os.path.join(dir_path, 'stargan_gen_{}.jpg'.format(j))
                        vutils.save_image(gen_noattack, out_file, nrow=1, normalize=True, range=(-1., 1.))
                        
                        gen = x_fake_list[j]
                        out_file = os.path.join(dir_path, 'stargan_advgen.jpg')
                        # out_file = os.path.join(dir_path, 'stargan_advgen_{}.jpg'.format(j))
                        vutils.save_image(gen, out_file, nrow=1, normalize=True, range=(-1., 1.))

                        gan_result["StarGAN"]["gen"] = os.path.join(out_path, 'stargan_gen.jpg')
                        gan_result["StarGAN"]["advgen"] = os.path.join(out_path, 'stargan_advgen.jpg')

                    break

                # AttentionGAN
                for idx, (img_a, att_a, c_org) in enumerate(self.test_dataloader):
                    img_a = img.cuda() if self.args_attack.global_settings.gpu else img_a
                    att_a = att_a.cuda() if self.args_attack.global_settings.gpu else att_a
                    att_a = att_a.type(torch.float)
                    x_noattack_list, x_fake_list = self.attentiongan_solver.test_universal_model_level(idx, img_a, c_org, self.pgd_attack.up, self.args_attack.AttentionGAN)
                    for j in range(len(x_fake_list)):
                        gen_noattack = x_noattack_list[j]
                        gen = x_fake_list[j]
                    
                    for j in [len(x_fake_list)-1]:#range(len(x_fake_list)):
                        gen_noattack = x_noattack_list[j]
                        out_file = os.path.join(dir_path, 'attentiongan_gen.jpg')
                        # out_file = os.path.join(dir_path, 'attentiongan_gen_{}.jpg'.format(j))
                        vutils.save_image(gen_noattack, out_file, nrow=1, normalize=True, range=(-1., 1.))
                        
                        gen = x_fake_list[j]
                        out_file = os.path.join(dir_path, 'attentiongan_advgen.jpg')
                        # out_file = os.path.join(dir_path, 'attentiongan_advgen_{}.jpg'.format(j))
                        vutils.save_image(gen, out_file, nrow=1, normalize=True, range=(-1., 1.))

                        gan_result["AttentionGAN"]["gen"] = os.path.join(out_path, 'attentiongan_gen.jpg')
                        gan_result["AttentionGAN"]["advgen"] = os.path.join(out_path, 'attentiongan_advgen.jpg')

                    break
                
                #HiSD
                for idx, (img_a, att_a, c_org) in enumerate(self.test_dataloader):
                    img_a = img.cuda() if self.args_attack.global_settings.gpu else img_a
                    
                    with torch.no_grad():
                        # clean
                        c = self.E(img_a)
                        c_trg = c
                        s_trg = self.F_(self.reference, 1)
                        c_trg = self.T(c_trg, s_trg, 1)
                        gen_noattack = self.G(c_trg)
                        # adv
                        c = self.E(img_a + self.pgd_attack.up)
                        c_trg = c
                        s_trg = self.F_(self.reference, 1)
                        c_trg = self.T(c_trg, s_trg, 1)
                        gen = self.G(c_trg)
                        mask = abs(gen_noattack - img_a)
                        mask = mask[0,0,:,:] + mask[0,1,:,:] + mask[0,2,:,:]
                        mask[mask>0.5] = 1
                        mask[mask<0.5] = 0

                        out_file = os.path.join(dir_path, 'HiSD_gen.jpg'.format(j))
                        vutils.save_image(gen_noattack, out_file, nrow=1, normalize=True, range=(-1., 1.))
                        
                        gen = x_fake_list[j]
                        out_file = os.path.join(dir_path, 'HiSD_advgen.jpg'.format(j))
                        vutils.save_image(gen, out_file, nrow=1, normalize=True, range=(-1., 1.))

                        gan_result["HiSD"]["gen"] = os.path.join(out_path, 'HiSD_gen.jpg')
                        gan_result["HiSD"]["advgen"] = os.path.join(out_path, 'HiSD_advgen.jpg')
                        
                    break
                response["faces"].append(gan_result)
                


        return response
            


    def parse(self,args=None):
        with open(join('./lib/watermark/setting.json'), 'r') as f:
            args_attack = json.load(f, object_hook=lambda d: argparse.Namespace(**d))
        return args_attack

    # init attacker
    def init_Attack(self,args_attack):
        pgd_attack = attacks.LinfPGDAttack(model=None, device=torch.device('cuda' if torch.cuda.is_available() else 'cpu'), epsilon=args_attack.attacks.epsilon, k=args_attack.attacks.k, a=args_attack.attacks.a, star_factor=args_attack.attacks.star_factor, attention_factor=args_attack.attacks.attention_factor, att_factor=args_attack.attacks.att_factor, HiSD_factor=args_attack.attacks.HiSD_factor, args=args_attack.attacks)
        return pgd_attack
