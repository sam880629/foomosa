// Edit User Name
    function editUsername(user_id) {
        const usernameElement = document.getElementById('username');
        const currentUsername = usernameElement.innerText;
    
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = currentUsername;
        // Add a class for styling
        inputElement.className = 'username-input';

        // Replace the username element with the input element
        usernameElement.innerHTML = '';
        usernameElement.appendChild(inputElement);

        // Focus on the input element
        inputElement.focus();

        // Handle Enter key press event
        document.addEventListener('keyup', function (event) {
            if (event.keyCode === 13) {
                // alert("執行成功!");
                var user_id = document.getElementById('user_id').value;
                var user_name = document.querySelector(".username-input").value;
                // console.log("我叫: " + user_name);
                // console.log("user_id: " + user_id);
        
                // Replace the input element with the updated username
                // usernameElement.innerHTML = user_name;

                // Send AJAX request to update the username in the database
                $.ajax({
                    url: '/membership/update/updateUserName',
                    method: 'PUT',
                    data: {
                        user_id: user_id,
                        user_name: user_name
                    },
                    success: function (response) {
                        alert("名字更新成功!!");
                        window.location.reload(); // 重新載入頁面以顯示更新後的評論
                    },
                    error: function (xhr, status, error) {
                        console.error('Error updating username:', error);
                    }
                });
            }
        });
    }