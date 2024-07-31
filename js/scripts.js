const hamburgerMenu = document.getElementById('hamburger-menu');
const navbarNav = document.querySelector('.navbar-nav');

hamburgerMenu.addEventListener('click', () => {
    navbarNav.classList.toggle('mobile-active');
    hamburgerMenu.classList.toggle('active');
});

//apiKey = 'AIzaSyDILNt02Y_tp7ZoZWSMKKd5B1M1cySimiU';
//playlistId = 'PLTY2rRVYPAx65NVxb8gAKNW57tY4FnJvA';

document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'AIzaSyDILNt02Y_tp7ZoZWSMKKd5B1M1cySimiU';
    const playlistId = 'PLTY2rRVYPAx65NVxb8gAKNW57tY4FnJvA';
    const maxResults = 8;
    let currentPageToken = '';
    let nextPageToken = '';
    let prevPageToken = '';
    let totalResults = 0;
    let totalPages = 0;
    let currentPage = 1;

    // Fetch videos from the playlist
    async function fetchPlaylistVideos(pageToken = '') {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&pageToken=${pageToken}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        totalResults = data.pageInfo.totalResults;
        totalPages = Math.ceil(totalResults / maxResults);
        nextPageToken = data.nextPageToken || '';
        prevPageToken = data.prevPageToken || '';
        return data.items;
    }

    // Display 4 random featured videos on index.html
    async function displayFeaturedVideos() {
        const videos = await fetchPlaylistVideos();
        const featuredCourses = document.getElementById('featuredCourses');
        if (featuredCourses) {
            const randomVideos = [];
            while (randomVideos.length < 4) {
                const randomIndex = Math.floor(Math.random() * videos.length);
                if (!randomVideos.includes(videos[randomIndex])) {
                    randomVideos.push(videos[randomIndex]);
                }
            }

            featuredCourses.innerHTML = randomVideos.map(video => `
                <div class="card">
                    <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                    <div class="card-body">
                        <h3>${video.snippet.title}</h3>
                        <a href="video.html?videoId=${video.snippet.resourceId.videoId}&title=${encodeURIComponent(video.snippet.title)}" class="btn">Watch Now</a>
                    </div>
                </div>
            `).join('');
        }
    }

    // Display paginated videos on courses.html
    async function displayPaginatedVideos(pageToken = '') {
        const videos = await fetchPlaylistVideos(pageToken);
        const videoGrid = document.getElementById('videoGrid');
        const pagination = document.getElementById('pagination');
        if (videoGrid && pagination) {
            videoGrid.innerHTML = videos.map(video => `
                <div class="card">
                    <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                    <div class="card-body">
                        <h3>${video.snippet.title}</h3>
                        <a href="video.html?videoId=${video.snippet.resourceId.videoId}&title=${encodeURIComponent(video.snippet.title)}" class="btn">Watch Now</a>
                    </div>
                </div>
            `).join('');

            // Update pagination controls
            pagination.innerHTML = `
                <button id="prevPage" ${prevPageToken ? '' : 'disabled'}>Previous</button>
                <span>Page ${currentPage} of ${totalPages}</span>
                <button id="nextPage" ${nextPageToken ? '' : 'disabled'}>Next</button>
            `;

            // Set up event listeners
            document.getElementById('prevPage')?.addEventListener('click', () => {
                currentPage--;
                displayPaginatedVideos(prevPageToken);
            });

            document.getElementById('nextPage')?.addEventListener('click', () => {
                currentPage++;
                displayPaginatedVideos(nextPageToken);
            });
        }
    }

    // Initialize functions based on the page
    if (document.getElementById('featuredCourses')) {
        displayFeaturedVideos();
    } else if (document.getElementById('videoGrid')) {
        displayPaginatedVideos();
    }
});
