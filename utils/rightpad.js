module.exports=function rightpad (str, width) {

  str = str.toString();

  while (str.length < width) {
    str += " ";
  }

  if (str.length > width) {
    return str.slice(0, width);
  }

  return str;

}
