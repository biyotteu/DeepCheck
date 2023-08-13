import argparse
import json
from os.path import join
import sys
from tqdm import tqdm
from PIL import Image


import torch
import torchvision.utils as vutils
from torchvision import transforms




from data import CelebA
import attacks



class ObjDict(dict):
    """
    Makes a  dictionary behave like an object,with attribute-style access.
    """
    def __getattr__(self,name):
        try:
            return self[name]
        except:
            raise AttributeError(name)
    def __setattr__(self,name,value):
        self[name]=value

def parse(args=None):
    with open(join('./setting.json'), 'r') as f:
        args_attack = json.load(f, object_hook=lambda d: argparse.Namespace(**d))
    return args_attack


# init attacker
def init_Attack(args_attack):
    pgd_attack = attacks.LinfPGDAttack(model=None, device=torch.device('cuda' if torch.cuda.is_available() else 'cpu'), epsilon=args_attack.attacks.epsilon, k=args_attack.attacks.k, a=args_attack.attacks.a, star_factor=args_attack.attacks.star_factor, attention_factor=args_attack.attacks.attention_factor, att_factor=args_attack.attacks.att_factor, HiSD_factor=args_attack.attacks.HiSD_factor, args=args_attack.attacks)
    return pgd_attack

if __name__ == "__main__":
    args_attack = parse()

    pgd_attack = init_Attack(args_attack)

    # load the trained CMUA-Watermark
    if args_attack.global_settings.universal_perturbation_path:
        pgd_attack.up = torch.load(args_attack.global_settings.universal_perturbation_path)

    tf = transforms.Compose([
            # transforms.CenterCrop(170),
            transforms.Resize(args_attack.global_settings.img_size),
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5)),
        ])

    image = Image.open(sys.argv[1])
    img = image.convert("RGB")
    img = tf(img).unsqueeze(0)

    out_file = './demo_results/test.jpg'
    vutils.save_image(
        img+pgd_attack.up, out_file,
        nrow=1, normalize=True, range=(-1., 1.)
    )
    
