import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/api/client';

export async function uploadProduct(formData) {
    return apiPost('/api/products', formData);
}

export async function deleteProject(title) {
    return apiDelete('/api/projects', { title });
}

export async function searchProjects(query, signal) {
    return apiGet('/api/projects', { params: { q: query }, signal });
}

export async function updateProject(project) {
    return apiPatch('/api/projects', project);
}