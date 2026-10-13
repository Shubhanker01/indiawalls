import axios from 'axios';

export async function uploadProduct(formData) {
    return axios.post('/api/product/upload', formData);
}

export async function deleteProject(title) {
    return axios.delete('/api/projects', { data: { title } });
}

export async function searchProjects(query, signal) {
    return axios.get('/api/projects', { params: { q: query }, signal });
}

export async function updateProject(project) {
    return axios.patch('/api/projects', project);
}