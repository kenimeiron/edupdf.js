// auth-patch.js - 在 viewer.html 中先于 viewer.js 加载
(function() {
    // 拦截 postMessage 调用
    const originalPostMessage = window.parent.postMessage;
    if (originalPostMessage) {
        window.parent.postMessage = function(message, targetOrigin, transfer) {
            // 过滤掉 post_get_auth_header 消息
            if (message && message.type === 'post_get_auth_header') {
                console.log('Blocked post_get_auth_header message');
                // 立即模拟响应
                setTimeout(() => {
                    if (window.parent && window.parent.postMessage) {
                        window.parent.postMessage({
                            type: 'get_auth_header',
                            params: { authHeader: {} }
                        }, '*');
                    }
                }, 0);
                return;
            }
            return originalPostMessage.call(this, message, targetOrigin, transfer);
        };
    }
    
    // 拦截消息监听器，过滤掉 post_get_auth_header 事件
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
        if (type === 'message') {
            const wrappedListener = function(event) {
                if (event.data && event.data.type === 'post_get_auth_header') {
                    // 忽略这个事件
                    console.log('Ignored post_get_auth_header event');
                    return;
                }
                return listener.call(this, event);
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    console.log('Auth patch applied');
})();