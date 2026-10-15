'use client';

export default function DeleteConfirmationModal({
    item,
    type,
    busy,
    error,
    onCancel,
    onConfirm,
}) {
    if (!item) return null;

    const contentType = type === 'blog' ? 'blog post' : 'testimonial';
    const title = item.title || item.name;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !busy) onCancel();
            }}
        >
            <section
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-confirmation-title"
                aria-describedby="delete-confirmation-description"
                className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            >
                <h2 id="delete-confirmation-title" className="text-xl font-bold text-white">
                    Delete {contentType}?
                </h2>
                <p id="delete-confirmation-description" className="mt-3 text-sm leading-relaxed text-slate-300">
                    Are you sure you want to delete <span className="font-semibold text-white">{title}</span>? This
                    action cannot be undone.
                </p>
                {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        disabled={busy}
                        onClick={onCancel}
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={onConfirm}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {busy ? 'Deleting…' : 'Delete'}
                    </button>
                </div>
            </section>
        </div>
    );
}
