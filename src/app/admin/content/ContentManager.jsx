'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const emptyBlog = { title: '', slug: '', excerpt: '', content: '', category: 'Industry Insights', readTime: '4 min read', coverImage: '', author: 'Rajasthanwalls Technical Desk', published: false };
const emptyTestimonial = { name: '', role: '', location: '', rating: 5, quote: '', avatar: '', order: 0, published: false };
const inputClass = 'mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white';

export default function ContentManager() {
    const [type, setType] = useState('blog');
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(emptyBlog);
    const [editingId, setEditingId] = useState('');
    const [status, setStatus] = useState({ message: '', error: false });
    const [busy, setBusy] = useState(false);
    const [coverImageFile, setCoverImageFile] = useState(null);
    const coverImageInputRef = useRef(null);
    const [pendingDelete, setPendingDelete] = useState(null);

    const loadItems = useCallback(async () => {
        try {
            const response = await fetch(`/api/content?type=${type}`, { cache: 'no-store' });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Could not load content.');
            setItems(data.items || []);
        } catch (error) {
            setStatus({ message: error.message, error: true });
        } finally {
            setBusy(false);
        }
    }, [type]);

    useEffect(() => {
        let isMounted = true;

        async function fetchItems() {
            try {
                const response = await fetch(`/api/content?type=${type}`, { cache: 'no-store' });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Could not load content.');
                if (isMounted) setItems(data.items || []);
            } catch (error) {
                if (isMounted) setStatus({ message: error.message, error: true });
            } finally {
                if (isMounted) setBusy(false);
            }
        }

        fetchItems();
        return () => {
            isMounted = false;
        };
    }, [type]);

    const editItem = (item) => {
        setEditingId(item._id);
        setCoverImageFile(null);
        if (coverImageInputRef.current) coverImageInputRef.current.value = '';
        setForm(type === 'blog'
            ? { ...emptyBlog, ...item, publishedAt: item.publishedAt ? new Date(item.publishedAt).toISOString().slice(0, 10) : '' }
            : { ...emptyTestimonial, ...item });
        setStatus({ message: '', error: false });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setEditingId('');
        setCoverImageFile(null);
        if (coverImageInputRef.current) coverImageInputRef.current.value = '';
        setForm(type === 'blog' ? emptyBlog : emptyTestimonial);
    };

    const submit = async (event) => {
        event.preventDefault();
        setBusy(true);
        setStatus({ message: '', error: false });
        try {
            const payload = { type, ...form, ...(editingId ? { id: editingId } : {}) };
            let requestBody = JSON.stringify(payload);
            const headers = { 'Content-Type': 'application/json' };
            if (type === 'blog') {
                const formData = new FormData();
                const { coverImage, ...blogPayload } = payload;
                formData.append('payload', JSON.stringify(blogPayload));
                if (coverImageFile) formData.append('coverImage', coverImageFile);
                requestBody = formData;
                delete headers['Content-Type'];
            }
            const response = await fetch('/api/content', {
                method: 'POST',
                headers,
                body: requestBody,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Could not save content.');
            setStatus({ message: editingId ? 'Changes saved.' : 'Content created.', error: false });
            resetForm();
            await loadItems();
        } catch (error) {
            setStatus({ message: error.message, error: true });
            setBusy(false);
        }
    };

    const removeItem = async () => {
        if (!pendingDelete) return;
        setBusy(true);
        setStatus({ message: '', error: false });
        try {
            const response = await fetch('/api/content', {
                method: 'DELETE', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: pendingDelete.type, id: pendingDelete.item._id }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Could not delete content.');
            if (editingId === pendingDelete.item._id) resetForm();
            setPendingDelete(null);
            setStatus({ message: 'Content deleted.', error: false });
            await loadItems();
        } catch (error) {
            setStatus({ message: error.message, error: true });
            setBusy(false);
        }
    };

    const change = (event) => {
        const { name, value, type: fieldType, checked } = event.target;
        setForm((current) => ({ ...current, [name]: fieldType === 'checkbox' ? checked : value }));
    };

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">Admin Panel</p>
                        <h1 className="mt-2 text-3xl font-bold">Blogs & Testimonials</h1>
                        <p className="mt-2 text-sm text-slate-400">Manage the content shown on the public site.</p>
                    </div>
                </div>

                <div className="mb-6 flex gap-2">
                    {['blog', 'testimonial'].map((tab) => <button key={tab} type="button" disabled={busy} onClick={() => { setType(tab); setItems([]); setBusy(true); setPendingDelete(null); setCoverImageFile(null); if (coverImageInputRef.current) coverImageInputRef.current.value = ''; setForm(tab === 'blog' ? emptyBlog : emptyTestimonial); setEditingId(''); setStatus({ message: '', error: false }); }} className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize disabled:opacity-50 ${type === tab ? 'bg-yellow-600 text-white' : 'border border-slate-700 text-slate-300'}`}>{tab === 'blog' ? 'Blog posts' : 'Testimonials'}</button>)}
                </div>

                {status.message && <p role="status" className={`mb-5 rounded-lg border p-3 text-sm ${status.error ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'}`}>{status.message}</p>}

                <form key={type} onSubmit={submit} className="mb-10 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-2 sm:p-7">
                    <h2 className="sm:col-span-2 text-lg font-bold">{editingId ? 'Edit entry' : `Add ${type === 'blog' ? 'blog post' : 'testimonial'}`}</h2>
                    {type === 'blog' ? <>
                        <label className="text-sm">Title<input className={inputClass} name="title" required value={form.title} onChange={change} /></label>
                        <label className="text-sm">URL slug<input className={inputClass} name="slug" value={form.slug} onChange={change} placeholder="Generated from title when blank" /></label>
                        <label className="text-sm">Category<input className={inputClass} name="category" value={form.category} onChange={change} /></label>
                        <label className="text-sm">Read time<input className={inputClass} name="readTime" value={form.readTime} onChange={change} /></label>
                        <label className="text-sm">Cover image<input ref={coverImageInputRef} className={inputClass} type="file" accept="image/jpeg,image/png,image/webp" required={!editingId} onChange={(event) => setCoverImageFile(event.target.files?.[0] || null)} />{form.coverImage && !coverImageFile && <span className="mt-1 block text-xs text-slate-400">Current cover image will be kept unless you choose a replacement.</span>}{coverImageFile && <span className="mt-1 block text-xs text-slate-400">Selected: {coverImageFile.name}</span>}<span className="mt-1 block text-xs text-slate-500">JPG, PNG, or WebP; maximum 4 MB.</span></label>
                        <label className="text-sm">Author<input className={inputClass} name="author" value={form.author} onChange={change} /></label>
                        <label className="sm:col-span-2 text-sm">Excerpt<textarea className={inputClass} name="excerpt" rows={2} required value={form.excerpt} onChange={change} /></label>
                        <label className="sm:col-span-2 text-sm">Article content (basic HTML formatting supported)<textarea className={`${inputClass} font-mono`} name="content" rows={12} required value={form.content} onChange={change} placeholder="Use paragraphs and headings: <p>...</p><h2>...</h2>" /></label>
                    </> : <>
                        <label className="text-sm">Name<input className={inputClass} name="name" required value={form.name} onChange={change} /></label>
                        <label className="text-sm">Role<input className={inputClass} name="role" value={form.role} onChange={change} /></label>
                        <label className="text-sm">Location<input className={inputClass} name="location" value={form.location} onChange={change} /></label>
                        <label className="text-sm">Rating<select className={inputClass} name="rating" value={form.rating} onChange={change}>{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select></label>
                        <label className="text-sm">Display order<input className={inputClass} name="order" type="number" value={form.order} onChange={change} /></label>
                        <label className="text-sm">Avatar URL<input className={inputClass} name="avatar" value={form.avatar} onChange={change} /></label>
                        <label className="sm:col-span-2 text-sm">Quote<textarea className={inputClass} name="quote" rows={4} required value={form.quote} onChange={change} /></label>
                    </>}
                    <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="published" checked={!!form.published} onChange={change} /> Published on the public site</label>
                    <div className="flex gap-3 sm:col-span-2">
                        <button disabled={busy} className="rounded-lg bg-yellow-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy ? 'Saving…' : editingId ? 'Save changes' : 'Create entry'}</button>
                        {editingId && <button type="button" onClick={resetForm} className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm">Cancel edit</button>}
                    </div>
                </form>

                <section>
                    <h2 className="mb-3 text-lg font-bold">Existing {type === 'blog' ? 'posts' : 'testimonials'} <span className="text-sm font-normal text-slate-400">({items.length})</span></h2>
                    {busy && items.length === 0 ? <p className="text-sm text-slate-400">Loading…</p> : items.length === 0 ? <p className="rounded-xl border border-slate-800 p-5 text-sm text-slate-400">No entries yet. Add one above to populate the public section.</p> : <div className="space-y-2">{items.map((item) => <article key={item._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4"><div className="min-w-0"><h3 className="truncate font-semibold">{item.title || item.name}</h3><p className="mt-1 text-xs text-slate-400">{type === 'blog' ? `/${item.slug} · ` : ''}{item.published ? 'Published' : 'Draft'}</p></div><div className="flex gap-2"><button type="button" disabled={busy} onClick={() => editItem(item)} className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold disabled:opacity-50">Edit</button><button type="button" disabled={busy} onClick={() => { setStatus({ message: '', error: false }); setPendingDelete({ item, type }); }} className="rounded-lg border border-red-900 px-3 py-1.5 text-xs font-semibold text-red-300 disabled:opacity-50">Delete</button></div></article>)}</div>}
                </section>
            </div>
            <DeleteConfirmationModal
                item={pendingDelete?.item}
                type={pendingDelete?.type}
                busy={busy}
                error={status.error ? status.message : ''}
                onCancel={() => setPendingDelete(null)}
                onConfirm={removeItem}
            />
        </main>
    );
}
