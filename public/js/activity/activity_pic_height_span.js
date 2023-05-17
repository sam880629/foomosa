//計算滾軸高度
// function adjustHeightV2() {
//   const card1_h = document.querySelector('#atcard1').offsetHeight;
//   //console.log(card1_h)
//   const card2_ch_h = document.querySelector('#atcard2 .card-header').offsetHeight;
//   const card2_th_h = document.querySelector('#atcard2 thead').offsetHeight;
//   const card2_tb_h = document.querySelector('#atcard2 tbody').offsetHeight;
//   //console.log(card2_ch_h)
//   //console.log(card2_th_h)

//   bgs_h = document.querySelector('#bgs').offsetHeight;
//   //const topHeight = firstCard.offsetHeight + secondCard.offsetHeight;
//   //console.log(bgs_h)
//   const x = card1_h + card2_ch_h;
//   //console.log(x)//322

//   document.querySelector('#at_table_tbody').style.height = 685 - x + 'px';
//   //console.log(document.querySelector('#at_table_tbody').style.height)
// }
// window.addEventListener('load', adjustHeightV2);
// window.addEventListener('resize', adjustHeightV2);


//上傳圖片click
const uploadIcon = document.getElementById('uploadIcon');
const fileUpload = document.getElementById('file_upload');
uploadIcon.addEventListener('click', () => {
  fileUpload.click();
});
//變更圖片預覽
fileUpload.addEventListener('change', function () {
  const reader = new FileReader();
  reader.onload = function () {
    const img = document.querySelector('.upload-container img');
    img.src = reader.result;
  }
  reader.readAsDataURL(this.files[0]);
});
// 取得 textarea 和 span 的 DOM 元素
var memo = document.getElementById("memo");
var helpBlock = document.getElementById("textareaHelpBlock");

// 當 textarea 內容改變時，計算文字數，並顯示在 span 中
memo.addEventListener("change", function () {
  var count = memo.value.length;
  helpBlock.textContent = "麻煩在這裡填寫活動相關說明 (" + count + "/100字)";
});