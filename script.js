const API_URL = 'http://localhost:3000/blogs';

async function loadPosts() {
    try {
        const res = await fetch(API_URL);
        const posts = await res.json();
document.getElementById('post-count').innerText = posts.length; // Считает количество постов
document.getElementById('last-update').innerText = new Date().toLocaleTimeString(); // Ставит время обновления
        const container = document.getElementById('posts-container');
        container.innerHTML = posts.map(p => `
            
            <div class="blog-card" style="background: #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #334155;">
                <h3 style="color: #38bdf8; margin-top: 0;">${p.title}</h3>
                <p style="color: #94a3b8;">${p.body}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <small style="color: #64748b;">By: ${p.author} | ${new Date(p.createdAt).toLocaleDateString()}</small>
                    <button onclick="deletePost('${p._id}')" style="background: none; border: none; cursor: pointer;">🗑️</button>
                </div>
            </div>
        `).reverse().join(''); 
    } catch (err) { console.error(err); }
}

async function submitPost() {
    // We are grabbing the values EXACTLY as named in your HTML
    const titleValue = document.getElementById('postTitle').value;
    const bodyValue = document.getElementById('postBody').value;
    const authorValue = document.getElementById('postAuthor').value;

    console.log("Sending data:", { titleValue, bodyValue }); // This helps us debug

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: titleValue,
                body: bodyValue,
                author: authorValue || "Anonymous"
            })
        });

        if (res.ok) {
            alert("🚀 Post Published!");
            location.reload(); 
        } else {
            const err = await res.json();
            alert("Server says: " + err.message);
        }
    } catch (e) {
        alert("Check if your server is running in the terminal!");
    }
}

async function deletePost(id) {
    if (confirm("Delete this post?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadPosts();
    }
}

loadPosts();