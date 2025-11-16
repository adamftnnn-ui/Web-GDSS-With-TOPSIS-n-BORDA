function showAlert(message, type, duration = 5000) {
    const processedMessage = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    const alertContainerId = 'alert-container-gdss';
    let container = document.getElementById(alertContainerId);

    if (!container) {
        container = document.createElement('div');
        container.id = alertContainerId;
        container.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] space-y-3 pointer-events-none w-full max-w-sm flex flex-col items-center';
        document.body.appendChild(container);
    }
    
    if (container.children.length > 0) {
        Array.from(container.children).forEach(child => child.remove());
    }

    let bgColor, borderColor, iconName, iconColor, textColor;
    switch (type) {
        case 'success':
            bgColor = 'bg-green-50';
            borderColor = 'border-green-400';
            iconName = 'check-circle';
            iconColor = 'text-green-600';
            textColor = 'text-green-700';
            break;
        case 'error':
            bgColor = 'bg-red-50';
            borderColor = 'border-red-400';
            iconName = 'x-octagon';
            iconColor = 'text-red-600';
            textColor = 'text-red-700';
            break;
        case 'info':
            bgColor = 'bg-blue-50';
            borderColor = 'border-blue-400';
            iconName = 'info';
            iconColor = 'text-blue-600';
            textColor = 'text-blue-700';
            break;
        case 'warning':
            bgColor = 'bg-yellow-50';
            borderColor = 'border-yellow-400';
            iconName = 'alert-triangle';
            iconColor = 'text-yellow-600';
            textColor = 'text-yellow-700';
            break;
        default:
            bgColor = 'bg-gray-100';
            borderColor = 'border-gray-400';
            iconName = 'bell';
            iconColor = 'text-gray-600';
            textColor = 'text-gray-700';
            break;
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `${bgColor} ${textColor} border-l-4 ${borderColor} p-4 rounded-lg shadow-lg w-full max-w-xs transition-all duration-300 ease-out transform -translate-y-full opacity-0 pointer-events-auto`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0 pt-0.5">
                <i data-feather="${iconName}" class="w-5 h-5 ${iconColor}"></i>
            </div>
            <div class="ml-3 flex-1">
                <p class="font-normal text-sm">${processedMessage}</p>
            </div>
            <div class="ml-4 flex-shrink-0 pt-0.5">
                <button type="button" class="close-alert p-1 -m-1.5 ${iconColor} hover:opacity-75 transition" title="Tutup">
                    <i data-feather="x" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `;

    container.appendChild(alertDiv);

    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    setTimeout(() => {
        alertDiv.classList.remove('-translate-y-full', 'opacity-0');
        alertDiv.classList.add('translate-y-0', 'opacity-100');
    }, 10);

    if (duration > 0) {
        setTimeout(() => {
            closeAlert(alertDiv);
        }, duration);
    }
    alertDiv.querySelector('.close-alert').addEventListener('click', () => {
        closeAlert(alertDiv);
    });

    function closeAlert(element) {
        element.classList.remove('translate-y-0', 'opacity-100');
        element.classList.add('-translate-y-full', 'opacity-0');

        element.addEventListener('transitionend', () => {
            element.remove();
            if (container && container.children.length === 0) {
                container.remove();
            }
        });
    }
}