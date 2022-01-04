const $catsList = document.querySelector('.cats-list');
const $postButton = document.querySelector('.btn.post');
const $postModal = document.querySelector('.post-modal');
const $postForm = document.querySelector('.post-form');
const $closeModal = document.querySelector('.close-modal');

let cats = [];

const render = () => {
  $catsList.innerHTML = cats
    .map(
      ({ id, url, liked, hashtags, content }) => `
      <li>
        <div data-id="${id}" class="card">
          <button class="edit-post">수정</button>
          <img src="${url}" alt="고양이">
          <button class="like" title="좋아요 누르기">
            <i class="${liked ? 'fas fa-heart' : 'far fa-heart'}"></i>
          </button>
          <div class="hash-list">
            ${hashtags.map(hashtag => `<span>${hashtag}</span>`).join('')}
          </div>
          <p class="comment">${content}</p>
        </div>
      </li>
    `
    )
    .join('');
};

const setCats = _cats => {
  cats = _cats;
  render();
};

const fetchCats = async () => {
  try {
    const { data: cats } = await axios.get('/cats');
    setCats(cats);
  } catch (e) {
    console.error(e);
  }
};

const generateId = () => Math.max(...cats.map(todo => todo.id), 0) + 1;

const addCats = async (url, hashtags, content) => {
  try {
    const { data: cats } = await axios.post('/cats', { id: generateId(), url, hashtags, content, liked: false });
    setCats(cats);
  } catch (e) {
    console.error(e);
  }
};

const toggleLiked = async id => {
  const { liked } = cats.find(cat => cat.id === +id);

  try {
    const { data: cats } = await axios.patch(`/cats/${id}`, { liked: !liked });
    setCats(cats);
  } catch (e) {
    console.error(e);
  }
};

const removeCats = async id => {
  try {
    const { data: cats } = await axios.delete(`/cats/${id}`);
    setCats(cats);
  } catch (e) {
    console.error(e);
  }
};

window.addEventListener('DOMContentLoaded', fetchCats);

$catsList.onclick = ({ target }) => {
  if (!target.matches('.like, .like *')) return;

  const { id } = target.closest('.card').dataset;
  toggleLiked(id);
};

$postButton.onclick = e => {
  $postModal.classList.remove('hidden');
};

$closeModal.onclick = e => {
  $postModal.classList.add('hidden');
  e.preventDefault();
};

$postForm.onsubmit = e => {
  e.preventDefault();
  const tempUrl = 'img/image01.jpeg';
  const tempHashtags = ['고양이', '임시', '냥스타그램'];
  const content = e.target.querySelector('.description').textContent;
  addCats(tempUrl, tempHashtags, content);
};
