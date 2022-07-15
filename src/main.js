function myComponent(){
  const divElement = document.createElement('div');
  const h2 = document.createElement('h2');
  h2.innerText = 'Nice';
  const img = document.createElement('img');
  img.src = "./assets/asdf.png";
  divElement.appendChild(h2);
  divElement.appendChild(img);
  return divElement;
}
document.body.appendChild(myComponent());