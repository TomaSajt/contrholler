export default function (node: HTMLElement) {

    function handleMousedown(event) {
        event.preventDefault();
        const rect = node.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        const rx = x - rect.left;
        const ry = y - rect.top;
        const sx = rx / rect.width;
        const sy = ry / rect.height;

        node.dispatchEvent(new CustomEvent('panstart', {
            detail: { x, y, rx, ry, sx, sy }
        }));

        window.addEventListener('mousemove', handleMousemove);
        window.addEventListener('mouseup', handleMouseup);
    }

    function handleMousemove(event) {
        const rect = node.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        const rx = x - rect.left;
        const ry = y - rect.top;
        const sx = rx / rect.width;
        const sy = ry / rect.height;

        node.dispatchEvent(new CustomEvent('panmove', {
            detail: { x, y, rx, ry, sx, sy }
        }));
    }

    function handleMouseup(event) {
        const rect = node.getBoundingClientRect();
        const x = event.clientX;
        const y = event.clientY;
        const rx = x - rect.left;
        const ry = y - rect.top;
        const sx = rx / rect.width;
        const sy = ry / rect.height;

        node.dispatchEvent(new CustomEvent('panend', {
            detail: { x, y, rx, ry, sx, sy }
        }));

        window.removeEventListener('mousemove', handleMousemove);
        window.removeEventListener('mouseup', handleMouseup);
    }

    node.addEventListener('mousedown', handleMousedown);

    return {
        destroy() {
            node.removeEventListener('mousedown', handleMousedown);
        }
    };
}