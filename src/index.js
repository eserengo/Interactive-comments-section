(async () => {
  const response = await fetch('./src/data.json');
  const data = await response.json();
  
  const displayData = () => {
    document.querySelector('body').insertAdjacentHTML('beforeend', `<main class='main flex-col'></main>`);
    document.querySelector('body').insertAdjacentHTML('beforeend', `<footer class='attribution'>Challenge by <a href='https://www.frontendmentor.io?ref=challenge' target='_blank'>Frontend Mentor</a>. Coded by <a href='https://github.com/eserengo/' target='_blank'>Federico Borzani </a></footer>`);
        
    const currentUser = {
      username: data.currentUser.username,
      avatar: data.currentUser.image.webp,
    };

    const generateID = () => {
      return Math.floor((Math.random() * 5) + 5)
    };

    const createComment = (arg, ref, replyingTo) => {
      arg.parentElement.parentElement.insertAdjacentHTML('beforeend',
        `<div class='pop-up flex-row'>
          <img class='avatar' src=${currentUser.avatar} alt='avatar'>
          <textarea cols='40' rows='4' class='reply-input' id='reply ${ref}' placeholder='Add a comment...' spellcheck='false' autocomplete='off'></textarea>
          <button type='button' class='send primary button uppercase selectable'>send</button>
        </div>`);
          
      document.querySelector('.send').addEventListener('click', () => {
        let valueEl = document.getElementById(`reply ${ref}`).value;
        let replyID = generateID();
        document.getElementById(ref).insertAdjacentHTML('afterend',
          `<section id=${replyID} class='rep'>
            <div class='container'>
              <div class='current-user flex-row elem-1'>
                <img class='avatar' src=${currentUser.avatar} alt='avatar'>
                <strong class='strong'>${currentUser.username}</strong>
                <span class='badge'>you</span>
                <p>0 days ago</p>
              </div>
              <div class='elem-2'>
                <strong class='strong'>@${replyingTo}</strong>
                <span class='content'> ${valueEl}</span>
              </div>
              <div class='score flex elem-3'>
                <img class='add-score icon selectable' src='./src/images/icon-plus.svg' alt='plus icon'>
                <p class='value'>0</p>
                <img class='remove-score icon selectable' src='./src/images/icon-minus.svg' alt='minus icon'>
              </div>
              <div class='flex-row elem-4'>
                <button type='button' class='delete secondary button selectable flex-row'>
                  <img class='icon' src='./src/images/icon-delete.svg' alt='delete icon'>
                  <p>Delete</p>
                </button>
                <button type='button' class='edit secondary button selectable flex-row'>
                  <img class='icon' src='./src/images/icon-edit.svg' alt='edit icon'>
                  <p>Edit</p>
                </button>
              </div>
            </div> 
          </section>`);
            
        document.querySelector('.pop-up').remove();
        let deleteEl = document.getElementById(`${replyID}`).querySelector('.delete');
        let editEl = document.getElementById(`${replyID}`).querySelector('.edit');
        deleteEl.addEventListener('click', () => deleteComment(deleteEl));
        editEl.addEventListener('click', () => editComment(editEl));
        DisplayOnResize();
      })
    };
                      
    const deleteComment = (arg) => {
      let targetEl = arg.parentElement.parentElement.parentElement.id;
      document.querySelector('main').insertAdjacentHTML('beforeend',
        `<div class='modal'>
          <div class='abs center'>
            <strong class='strong'>Delete comment</strong>
            <p>Are you sure you want to delete this comment? This will remove the comment and cannot be undone.</p>
            <span class='flex-row'>
              <button type='button' class='cancel primary button uppercase selectable' data-dismiss='modal'>no, cancel</button>
              <button type='button' class='confirm primary button uppercase selectable'>yes, delete</button>
            </span>
          </div>
        </div>`);
      
      document.querySelector('.modal').querySelector('.cancel').addEventListener('click', () => {
        document.querySelector('.modal').remove();
      })

      document.querySelector('.modal').querySelector('.confirm').addEventListener('click', () => {
        document.getElementById(targetEl).remove();
        document.querySelector('.modal').remove();
      })
    };
    
    const editComment = (arg) => {
      let targetEl = arg.parentElement.parentElement.parentElement.id;
      let contentEl = document.getElementById(targetEl).querySelector('.content');
      document.getElementById(targetEl).querySelector('.elem-2').classList.add('hidden');
      document.getElementById(targetEl).querySelector('.current-user').insertAdjacentHTML('afterend',
        `<div class='wrapper flex-col'>
          <textarea cols='40' rows='4' class='edit-input' id='edit ${targetEl}' spellcheck='false' autocomplete='off'>${contentEl.textContent}</textarea>
          <button type='button' class='update primary button uppercase selectable'>update</button>
        </div>`);
      let inputEl = document.getElementById(`edit ${targetEl}`);
      document.querySelector('.update').addEventListener('click', () => {
        contentEl.textContent = inputEl.value;
        document.getElementById(targetEl).querySelector('.elem-2').classList.remove('hidden');
        document.querySelector('.wrapper').remove();
      })
    };

    const addScore = (event, ref) => {
      let targetEl = event.target.parentElement.querySelector('.value');
      let valueEl = parseInt(targetEl.textContent, 10);
      if (valueEl == ref) {
        targetEl.textContent = valueEl + 1;
      }
    };

    const removeScore = (event, ref) => {
      let targetEl = event.target.parentElement.querySelector('.value');
      let valueEl = parseInt(targetEl.textContent, 10);
      if (valueEl - 1 == ref) {
        targetEl.textContent = valueEl - 1;
      }
    };

    if (Object.hasOwn(data, 'comments')) {
      data.comments.map(comment => {
        document.querySelector('.main').insertAdjacentHTML('beforeend',
          `<section id=${comment.id} class='comment flex-col'>
            <div class='container'>
              <div class='comment-user flex-row elem-1'>
                <img class='avatar' src=${comment.user.image.webp} alt='avatar'>
                <strong class='strong'>${comment.user.username}</strong>
                <p>${comment.createdAt}</p>
              </div>
              <p class='content elem-2'>${comment.content}</p>
              <div class='score flex elem-3'>
                <img class='add-score icon selectable' src='./src/images/icon-plus.svg' alt='plus icon'>
                <p class='value'>${comment.score}</p>
                <img class='remove-score icon selectable' src='./src/images/icon-minus.svg' alt='minus icon'>
              </div>
              <button type='button' class='reply secondary button flex-row selectable elem-4'>
                <img class='icon' src='./src/images/icon-reply.svg' alt='reply icon'>
                <p>Reply</p>
              </button>
            </div>
          </section>`);
        
        let replyEl = document.getElementById(`${comment.id}`).querySelector('.reply');  
        replyEl.addEventListener('click', () => createComment(replyEl, `${comment.id}`, `${comment.user.username}`));
        document.getElementById(`${comment.id}`).querySelector('.add-score').addEventListener('click', (event) => addScore(event, `${comment.score}`));
        document.getElementById(`${comment.id}`).querySelector('.remove-score').addEventListener('click', (event) => removeScore(event, `${comment.score}`));
       
        if (Object.hasOwn(comment, 'replies')) {
          comment.replies.map(reply => {
            if (reply.user.username != currentUser.username) {
              document.getElementById(`${comment.id}`).insertAdjacentHTML('beforeend',
                `<section id=${reply.id} class='rep'>
                  <div class='container'>
                    <div class='reply-user flex-row elem-1'>
                      <img class='avatar' src=${reply.user.image.webp} alt='avatar'>
                      <strong class='strong'>${reply.user.username}</strong>
                      <p>${reply.createdAt}</p>
                    </div>
                    <div class='elem-2'>
                      <strong class='strong'>@${reply.replyingTo}</strong>
                      <span class='content'> ${reply.content}</span>
                    </div>
                    <div class='score flex elem-3'>
                      <img class='add-score icon selectable' src='./src/images/icon-plus.svg' alt='plus icon'>
                      <p class='value'>${reply.score}</p>
                      <img class='remove-score icon selectable' src='./src/images/icon-minus.svg' alt='minus icon'>
                    </div>
                    <button type='button' class='reply secondary button flex-row selectable elem-4'>
                      <img class='icon' src='./src/images/icon-reply.svg' alt='reply icon'>
                      <p>Reply</p>
                    </button>
                  </div>
                </section>`);
              
              let replyEl = document.getElementById(`${reply.id}`).querySelector('.reply');
              replyEl.addEventListener('click', () => createComment(replyEl, `${reply.id}`, `${reply.user.username}`));
              document.getElementById(`${reply.id}`).querySelector('.add-score').addEventListener('click', (event) => addScore(event, `${reply.score}`));
              document.getElementById(`${reply.id}`).querySelector('.remove-score').addEventListener('click', (event) => removeScore(event, `${reply.score}`));

            } else {
              document.getElementById(`${comment.id}`).insertAdjacentHTML('beforeend',
                `<section id=${reply.id} class='rep'>
                  <div class='container'>
                    <div class='current-user flex-row elem-1'>
                      <img class='avatar' src=${currentUser.avatar} alt='avatar'>
                      <strong class='strong'>${currentUser.username}</strong>
                      <span class='badge'>you</span>
                      <p>${reply.createdAt}</p>
                    </div>
                    <div class='elem-2'>
                      <strong class='strong'>@${reply.replyingTo}</strong>
                      <span class='content'> ${reply.content}</span>
                    </div>
                    <div class='score flex elem-3'>
                      <img class='add-score icon selectable' src='./src/images/icon-plus.svg' alt='plus icon'>
                      <p class='value'>${reply.score}</p>
                      <img class='remove-score icon selectable' src='./src/images/icon-minus.svg' alt='minus icon'>
                    </div>
                    <div class='flex-row elem-4'>
                      <button type='button' class='delete secondary button flex-row selectable'>
                        <img class='icon' src='./src/images/icon-delete.svg' alt='delete icon'>
                        <p>Delete</p>
                      </button>
                      <button type='button' class='edit secondary button flex-row selectable'>
                        <img class='icon' src='./src/images/icon-edit.svg' alt='edit icon'>
                        <p>Edit</p>
                      </button>
                    </div>
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
      document.querySelectorAll('.flex').forEach(item => {
        item.classList.remove('flex-col');
        item.classList.add('flex-row');
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
      document.querySelectorAll('.flex').forEach(item => {
        item.classList.remove('flex-row');
        item.classList.add('flex-col');
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