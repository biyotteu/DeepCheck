const results = {}

const checkImages = ()=>{
    const imageTags = document.getElementsByTagName('img');
    const imageUrls = Array.from(imageTags).map(img => (img.src));
    const urls = imageUrls.filter(url=>!Object.keys(results).includes(url))
    console.log(urls.length)
    if(urls.length === 0) return;
    fetch("https://218.149.220.237:3001/imagesFromUrls/", {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            urls:urls
        }),
    }).then(res=>res.json()).then(res=>{
        Object.assign(results, res)
        Array.from(imageTags).forEach((img, i) => {
            if(results[img.src]){
                img.src = "https://img.seoul.co.kr/img/upload/2022/11/13/SSI_20221113151118_O2.jpg"
            }
        })
    }).catch(err=>console.log(err))
}

checkImages();

const callback = function(mutationsList, observer) {
    checkImages();
};
const targetNode = document.getElementsByTagName('body')[0];
const config = { attributes: true, childList: true, subtree: true };
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);