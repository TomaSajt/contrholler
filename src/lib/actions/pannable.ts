export default function (node: HTMLElement) {

    let x: number, y: number

    function handleTouchstart(event: TouchEvent) {
        event.preventDefault();
        panstart(event.touches[0])
    }
    function handleMousedown(event: MouseEvent) {
        event.preventDefault();
        panstart(event)
    }
    function panstart(data: MouseEvent | Touch) {
        const rect = node.getBoundingClientRect();
        x = data.clientX;
        y = data.clientY;
        const rx = x - rect.left;
        const ry = y - rect.top;
        const sx = rx / rect.width;
        const sy = ry / rect.height;

        node.dispatchEvent(new CustomEvent('panstart', {
            detail: { x, y, rx, ry, sx, sy }
        }));

        window.addEventListener('mousemove', handleMousemove);
        window.addEventListener('touchmove', handleTouchmove);
        window.addEventListener('mouseup', handleMouseup);
        window.addEventListener('touchend', handleTouchend);
    }

    function handleMousemove(event: MouseEvent) {
        panmove(event);
    }
    function handleTouchmove(event: TouchEvent) {
        panmove(event.touches[0])
    }

    function panmove(event: MouseEvent | Touch) {
        const rect = node.getBoundingClientRect();
        x = event.clientX;
        y = event.clientY;
        const rx = x - rect.left;
        const ry = y - rect.top;
        const sx = rx / rect.width;
        const sy = ry / rect.height;

        node.dispatchEvent(new CustomEvent('panmove', {
            detail: { x, y, rx, ry, sx, sy }
        }));
    }

    function handleMouseup(event: MouseEvent) {
        panend(event)
    }
    function handleTouchend() {
        panend()
    }

    function panend(event?: MouseEvent) {
        const rect = node.getBoundingClientRect();
        if (event) {
            x = event.clientX;
            y = event.clientY;
        }
        const rx = x - rect.left;
        const ry = y - rect.top;
        const sx = rx / rect.width;
        const sy = ry / rect.height;
        node.dispatchEvent(new CustomEvent('panend', {
            detail: { x, y, rx, ry, sx, sy }
        }));


        window.removeEventListener('mousemove', handleMousemove);
        window.removeEventListener('touchmove', handleTouchmove);
        window.removeEventListener('mouseup', handleMouseup);
        window.removeEventListener('touchend', handleTouchend);

    }

    node.addEventListener('mousedown', handleMousedown);
    node.addEventListener('touchstart', handleTouchstart);



    return {
        destroy() {
            node.removeEventListener('mousedown', handleMousedown);
            node.removeEventListener('touchstart', handleTouchstart);
        }
    };
}