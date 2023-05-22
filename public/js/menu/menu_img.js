$(document).ready(function () {
  async function checkImageExists(imgData) {
    return await $.ajax({
      type: 'POST',
      url: '/menu_imginsert/check_image_exists',
      data: imgData,
      processData: false,
      contentType: false,
    });
  }

  async function deleteOldImage(imgData) {
    return await $.ajax({
      type: 'POST',
      url: '/menu_imginsert/delete_old_image',
      data: imgData,
      processData: false,
      contentType: false,
    });
  }

  async function uploadImage(imgData) {
    return await $.ajax({
      type: 'POST',
      url: '/menu_imginsert/upload_image',
      data: imgData,
      processData: false,
      contentType: false,
    });
  }

  $('#imgForm').on('submit', async function (e) {
    e.preventDefault(); // 阻止表單的自動提交

    const imgData = new FormData();
    const imgFiles = $('#image_files')[0].files;
    if (imgFiles.length === 0) {
      alert('未上傳任何圖片');
      return;
    }
    // console.log(imgFiles);
    for (let i = 0; i < imgFiles.length; i++) {
      imgData.append('image_files', imgFiles[i]);
      // console.log(...imgData.entries());
    }

    try {
      const checkResult = await checkImageExists(imgData);
      if (checkResult.exists) {
        const confirmDelete = confirm('已選擇以下圖片：' + checkResult.files.join(', ') + '。如有重複檔名圖片將進行取代確定要上傳新圖片嗎？');
        if (confirmDelete) {
          await deleteOldImage(imgData);
        } else {
          return;
        }
      }
      const uploadResult = await uploadImage(imgData);
      // console.log(uploadResult);
      location.reload();
    } catch (error) {
      console.error(error);
    }
  });
});
