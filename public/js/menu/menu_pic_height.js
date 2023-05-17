// function adjustHeight() {
//     const card1_h = document.querySelector('#card1').offsetHeight;
//     //console.log(card1_h)
//     const card2_h = document.querySelector('#card2').offsetHeight;
//     //console.log(card2_h)
//     const card3_th_h = document.querySelector('#card3 thead').offsetHeight;
//     const card3_ch_h = document.querySelector('#card3 .card-header').offsetHeight;
//     const card3_tb_h = document.querySelector('#card3 tbody').offsetHeight;
//     //console.log(card3_th_h)

//     const papaH = document.querySelector('#papa').offsetHeight;
//     //const parentHeight = thirdCard.parentNode.offsetHeight;
//     //console.log(papaH)
//     bgs_h = document.querySelector('#bgs').offsetHeight;
//     //const topHeight = firstCard.offsetHeight + secondCard.offsetHeight;
//     //console.log(bgs_h)
//     const x = card1_h + card2_h + card3_ch_h + card3_th_h;
//     //console.log(x)//322

//     document.querySelector('#menu_table_tbody').style.height = bgs_h - x + 'px';
//     //console.log(document.querySelector('#menu_table_tbody').style.height)
//   }
//   window.addEventListener('load', adjustHeight);
//   window.addEventListener('resize', adjustHeight);

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
