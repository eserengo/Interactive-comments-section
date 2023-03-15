(async () => {
  const response = await fetch('./src/data.json');
  const data = await response.json();
  
  const displayData = () => {
    document.querySelector('body').insertAdjacentHTML('beforeend', `<main class='container'></main>`);
        
    const currentUser = {
      username: data.currentUser.username,
      avatar: data.currentUser.image.webp,
    };

    const generateID = () => {
      return Math.floor((Math.random() * 5) + 5)
    };

    const createComment = (event, ref, replyingTo) => {
      event.target.parentElement.insertAdjacentHTML('beforeend',
        `<div class='pop-up'>
          <img class='avatar img-fluid' src=${currentUser.avatar} alt='avatar'>
          <input type='text' class='reply-input' id='reply ${ref}' placeholder='Add a comment...' >
          <button type='button' class='send btn btn-primary uppercase'>reply</button>
        </div>`);
          
      document.querySelector('.send').addEventListener('click', () => {
        let valueEl = document.getElementById(`reply ${ref}`).value;
        let replyID = generateID();
        document.getElementById(ref).insertAdjacentHTML('afterend',
          `<section id=${replyID} class='reply'>
            <div class='current-user d-inline-flex'>
              <img class='avatar img-fluid' src=${currentUser.avatar} alt='avatar'>
              <strong>${currentUser.username}</strong>
              <span class='badge bg-primary'>you</span>
              <p>just now</p>
            </div>
            <div>
              <strong>@${replyingTo}</strong>
              <span class='content'> ${valueEl}</span>
            </div>
            <div class='score'>
              <img class='add-score img-fluid selectable' src='./src/images/icon-plus.svg' alt='plus icon'>
              <p class='value'>0</p>
              <img class='remove-score img-fluid selectable' src='./src/images/icon-minus.svg' alt='minus icon'>
            </div>
            <div class='d-inline-flex'>
              <button type='button' class='delete btn btn-secondary d-inline-flex'>
                <img class='img-fluid' src='./src/images/icon-delete.svg' alt='delete icon'>
                <p>Delete</p>
              </button>
              <button type='button' class='edit btn btn-secondary d-inline-flex'>
                <img class='img-fluid' src='./src/images/icon-edit.svg' alt='edit icon'>
                <p>Edit</p>
              </button>
            </div>  
          </section>`);
            
        document.querySelector('.pop-up').remove();
        let deleteEl = document.getElementById(`${replyID}`).querySelector('.delete');
        let editEl = document.getElementById(`${replyID}`).querySelector('.edit');
        deleteEl.addEventListener('click', () => deleteComment(deleteEl));
        editEl.addEventListener('click', () => editComment(editEl));
      })
    };
                      
    const deleteComment = (arg) => {
      let targetEl = arg.parentElement.parentElement.id;
      document.querySelector('main').insertAdjacentHTML('beforeend',
        `<div class='delete-modal'>
          <strong>Delete comment</strong>
          <p>Are you sure you want to delete this comment? This will remove the comment and cannot be undone.</p>
          <span class='btn-group-sm'>
            <button type='button' class='cancel btn btn-secondary uppercase' data-dismiss='modal'>no, cancel</button>
            <button type='button' class='confirm btn btn-primary uppercase'>yes, delete</button>
          </span>
        </div>`);
      
      document.querySelector('.delete-modal').querySelector('.cancel').addEventListener('click', () => {
        document.querySelector('.delete-modal').remove();
      })

      document.querySelector('.delete-modal').querySelector('.confirm').addEventListener('click', () => {
        document.getElementById(targetEl).remove();
        document.querySelector('.delete-modal').remove();
      })
    };
    
    const editComment = (arg) => {
      let targetEl = arg.parentElement.parentElement.id;
      let contentEl = document.getElementById(targetEl).querySelector('.content');
      contentEl.classList.add('hidden');
      document.getElementById(targetEl).querySelector('.current-user').insertAdjacentHTML('afterend',
        `<input type='text' class='edit-input' id='edit ${targetEl}' value='${contentEl.textContent}' >
        <button type='button' class='update btn btn-primary uppercase'>update</button>`);
      let inputEl = document.getElementById(`edit ${targetEl}`);
      document.querySelector('.update').addEventListener('click', () => {
        contentEl.textContent = inputEl.value;
        contentEl.classList.remove('hidden');
        inputEl.remove();
        document.querySelector('.update').remove();
      })
    };

    const addScore = (event, ref) => {
      let targetEl = event.target.parentElement.querySelector('.value');
      let valueEl = parseInt(event.target.parentElement.querySelector('.value').textContent, 10);
      if (valueEl == ref) {
        targetEl.textContent = valueEl + 1;
      }
    };

    const removeScore = (event, ref) => {
      let targetEl = event.target.parentElement.querySelector('.value');
      let valueEl = parseInt(event.target.parentElement.querySelector('.value').textContent, 10);
      if (valueEl - 1 == ref) {
        targetEl.textContent = valueEl - 1;
      }
    };

    if (Object.hasOwn(data, 'comments')) {
      data.comments.map(comment => {
        document.querySelector('.container').insertAdjacentHTML('beforeend',
          `<section id=${comment.id} class='comment'>
            <div class='comment-user d-inline-flex'>
              <img class='avatar img-fluid' src=${comment.user.image.webp} alt='avatar'>
              <strong>${comment.user.username}</strong>
              <p>${comment.createdAt}</p>
            </div>
            <p class='content'>${comment.content}</p>
            <div class='score'>
              <img class='add-score img-fluid selectable' src='./src/images/icon-plus.svg' alt='plus icon'>
              <p class='value'>${comment.score}</p>
              <img class='remove-score img-fluid selectable' src='./src/images/icon-minus.svg' alt='minus icon'>
            </div>
            <button type='button' class='reply btn btn-secondary d-inline-flex'>
              <img class='img-fluid' src='./src/images/icon-reply.svg' alt='reply icon'>
              <p>Reply</p>
            </button>
          </section>`);
          
        document.getElementById(`${comment.id}`).querySelector('.reply').addEventListener('click', (event) => createComment(event, `${comment.id}`, `${comment.user.username}`));
        document.getElementById(`${comment.id}`).querySelector('.add-score').addEventListener('click', (event) => addScore(event, `${comment.score}`));
        document.getElementById(`${comment.id}`).querySelector('.remove-score').addEventListener('click', (event) => removeScore(event, `${comment.score}`));
       
        if (Object.hasOwn(comment, 'replies')) {
          comment.replies.map(reply => {
            if (reply.user.username != currentUser.username) {
              document.getElementById(`${comment.id}`).insertAdjacentHTML('beforeend',
                `<section id=${reply.id} class='reply'>
                  <div class='reply-user d-inline-flex'>
                    <img class='avatar img-fluid' src=${reply.user.image.webp} alt='avatar'>
                    <strong>${reply.user.username}</strong>
                    <p>${reply.createdAt}</p>
                  </div>
                  <div>
                    <strong>@${reply.replyingTo}</strong>
                    <span class='content'> ${reply.content}</span>
                  </div>
                  <div class='score'>
                    <img class='add-score img-fluid selectable' src='./src/images/icon-plus.svg' alt='plus icon'>
                    <p class='value'>${reply.score}</p>
                    <img class='remove-score img-fluid selectable' src='./src/images/icon-minus.svg' alt='minus icon'>
                  </div>
                  <button type='button' class='reply btn btn-secondary d-inline-flex'>
                    <img class='img-fluid' src='./src/images/icon-reply.svg' alt='reply icon'>
                    <p>Reply</p>
                  </button>
                </section>`);
              
              document.getElementById(`${reply.id}`).querySelector('.reply').addEventListener('click', (event) => createComment(event, `${reply.id}`, `${reply.user.username}`));
              document.getElementById(`${reply.id}`).querySelector('.add-score').addEventListener('click', (event) => addScore(event, `${reply.score}`));
              document.getElementById(`${reply.id}`).querySelector('.remove-score').addEventListener('click', (event) => removeScore(event, `${reply.score}`));

            } else {
              document.getElementById(`${comment.id}`).insertAdjacentHTML('beforeend',
                `<section id=${reply.id} class='reply'>
                  <div class='current-user d-inline-flex'>
                    <img class='avatar img-fluid' src=${currentUser.avatar} alt='avatar'>
                    <strong>${currentUser.username}</strong>
                    <span class='badge bg-primary'>you</span>
                    <p>${reply.createdAt}</p>
                  </div>
                  <div>
                    <strong>@${reply.replyingTo}</strong>
                    <span class='content'> ${reply.content}</span>
                  </div>
                  <div class='score'>
                    <img class='add-score img-fluid selectable' src='./src/images/icon-plus.svg' alt='plus icon'>
                    <p class='value'>${reply.score}</p>
                    <img class='remove-score img-fluid selectable' src='./src/images/icon-minus.svg' alt='minus icon'>
                  </div>
                  <div class='d-inline-flex'>
                    <button type='button' class='delete btn btn-secondary d-inline-flex'>
                      <img class='img-fluid' src='./src/images/icon-delete.svg' alt='delete icon'>
                      <p>Delete</p>
                    </button>
                    <button type='button' class='edit btn btn-secondary d-inline-flex'>
                      <img class='img-fluid' src='./src/images/icon-edit.svg' alt='edit icon'>
                      <p>Edit</p>
                    </button>
                  </div>  
                </section>`);
              
              let deleteEl = document.getElementById(`${comment.id}`).querySelector('.delete');
              let editEl = document.getElementById(`${comment.id}`).querySelector('.edit');
              deleteEl.addEventListener('click', () => deleteComment(deleteEl));
              editEl.addEventListener('click', () => editComment(editEl));
            }
          })
        }
      })
    }
  };
  
  const DisplayOnResize = () => {
    if (window.matchMedia("(width<=375px)").matches) { 
      // RULES
      document.querySelectorAll('.desktop').forEach(item => {
        item.classList.add('hidden');
      })
      document.querySelectorAll('.mobile').forEach(item => {
        item.classList.remove('hidden');
      })
    }

    if (window.matchMedia("(width>375px)").matches) {
      // RULES
      document.querySelectorAll('.mobile').forEach(item => {
        item.classList.add('hidden');
      })
      document.querySelectorAll('.desktop').forEach(item => {
        item.classList.remove('hidden');
      })
    }
  }

  window.addEventListener('resize', () => {
    let timer;
    window.clearTimeout(timer);
    timer = window.setTimeout(DisplayOnResize(), 500);
  });

  displayData();
  DisplayOnResize();
})();