export function setFileInputFiles(input, files) {
    if (!input) return;

    const transfer = new DataTransfer();
    files.forEach((file) => transfer.items.add(file));
    input.files = transfer.files;
}
