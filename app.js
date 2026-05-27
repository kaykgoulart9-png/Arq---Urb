/* ========================================
   BevStock - Application Core
   Beverage Inventory Control System
   ======================================== */

const STORAGE_KEYS = {
    products: 'bevstock_products',
    movements: 'bevstock_movements',
    categories: 'bevstock_categories',
};

const DEFAULT_CATEGORIES = [
    { id: 'cat-1', name: 'Cervejas', icon: '🍺', color: '#f59e0b' },
    { id: 'cat-2', name: 'Vinhos', icon: '🍷', color: '#ef4444' },
    { id: 'cat-3', name: 'Destilados', icon: '🥃', color: '#e8a33d' },
    { id: 'cat-4', name: 'Refrigerantes', icon: '🥤', color: '#3b82f6' },
    { id: 'cat-5', name: 'Sucos', icon: '🧃', color: '#10b981' },
    { id: 'cat-6', name: 'Águas', icon: '💧', color: '#06b6d4' },
    { id: 'cat-7', name: 'Energéticos', icon: '⚡', color: '#8b5cf6' },
];

const SAMPLE_PRODUCTS = [
    { id: 'p1', name: 'Cerveja IPA Artesanal', brand: 'BrewDog', categoryId: 'cat-1', volume: '350ml', purchasePrice: 8.5, salePrice: 14.9, quantity: 48, minStock: 12, supplier: 'Distribuidora Hop', description: 'IPA encorpada com notas cítricas e amargor equilibrado.', sku: 'IPA-350', expiryDate: '' },
    { id: 'p2', name: 'Vinho Tinto Reserva', brand: 'Casillero del Diablo', categoryId: 'cat-2', volume: '750ml', purchasePrice: 32.0, salePrice: 59.9, quantity: 15, minStock: 5, supplier: 'Importadora Vinhos SA', description: 'Cabernet Sauvignon chileno com taninos macios.', sku: 'VIN-750', expiryDate: '' },
    { id: 'p3', name: 'Whisky 12 Anos', brand: 'Johnnie Walker', categoryId: 'cat-3', volume: '750ml', purchasePrice: 89.9, salePrice: 159.9, quantity: 8, minStock: 3, supplier: 'Diageo Brasil', description: 'Blend suave com notas de mel e baunilha.', sku: 'WHI-750', expiryDate: '' },
    { id: 'p4', name: 'Coca-Cola Lata', brand: 'Coca-Cola', categoryId: 'cat-4', volume: '350ml', purchasePrice: 2.5, salePrice: 5.0, quantity: 120, minStock: 24, supplier: 'Coca-Cola FEMSA', description: 'O refrigerante mais vendido do mundo.', sku: 'COC-350', expiryDate: '' },
    { id: 'p5', name: 'Suco de Laranja Natural', brand: 'Natural One', categoryId: 'cat-5', volume: '900ml', purchasePrice: 9.8, salePrice: 16.9, quantity: 20, minStock: 8, supplier: 'Natural One Ltda', description: 'Suco integral sem adição de açúcar.', sku: 'SUC-900', expiryDate: '' },
    { id: 'p6', name: 'Água Mineral Premium', brand: 'San Pellegrino', categoryId: 'cat-6', volume: '500ml', purchasePrice: 4.5, salePrice: 8.9, quantity: 60, minStock: 20, supplier: 'Nestlé Waters', description: 'Água mineral com gás, importada da Itália.', sku: 'AGU-500', expiryDate: '' },
    { id: 'p7', name: 'Energético Monster', brand: 'Monster Energy', categoryId: 'cat-7', volume: '473ml', purchasePrice: 6.9, salePrice: 11.9, quantity: 36, minStock: 10, supplier: 'Monster Beverage', description: 'Bebida energética sabor original.', sku: 'ENG-473', expiryDate: '' },
];

const SAMPLE_MOVEMENTS = [
    { id: 'mov-1', productId: 'p1', type: 'entry', quantity: 24, reason: 'Compra de fornecedor', notes: '', date: getDateDaysAgo(6) },
    { id: 'mov-2', productId: 'p4', type: 'entry', quantity: 48, reason: 'Compra de fornecedor', notes: '', date: getDateDaysAgo(5) },
    { id: 'mov-3', productId: 'p3', type: 'entry', quantity: 6, reason: 'Ajuste de inventário', notes: '', date: getDateDaysAgo(4) },
    { id: 'mov-4', productId: 'p6', type: 'entry', quantity: 30, reason: 'Compra de fornecedor', notes: '', date: getDateDaysAgo(3) },
    { id: 'mov-5', productId: 'p7', type: 'entry', quantity: 12, reason: 'Compra de fornecedor', notes: '', date: getDateDaysAgo(2) },
    { id: 'mov-6', productId: 'p2', type: 'entry', quantity: 10, reason: 'Compra de fornecedor', notes: '', date: getDateDaysAgo(1) },
    { id: 'mov-7', productId: 'p1', type: 'exit', quantity: 6, reason: 'Venda', notes: '', date: getDateDaysAgo(5) },
    { id: 'mov-8', productId: 'p4', type: 'exit', quantity: 12, reason: 'Venda', notes: '', date: getDateDaysAgo(4) },
    { id: 'mov-9', productId: 'p3', type: 'exit', quantity: 8, reason: 'Venda', notes: '', date: getDateDaysAgo(3) },
    { id: 'mov-10', productId: 'p2', type: 'exit', quantity: 2, reason: 'Venda', notes: '', date: getDateDaysAgo(2) },
];

function getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(10, 0, 0, 0);
    return date.toISOString();
}

function generateId(prefix = 'id') {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadData(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch (error) {
        return fallback;
    }
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

let categories = loadData(STORAGE_KEYS.categories, null);
let products = loadData(STORAGE_KEYS.products, null);
let movements = loadData(STORAGE_KEYS.movements, null);

if (!categories) {
    categories = [...DEFAULT_CATEGORIES];
    saveData(STORAGE_KEYS.categories, categories);
}

if (!products) {
    products = [...SAMPLE_PRODUCTS];
    saveData(STORAGE_KEYS.products, products);
}

if (!movements) {
    movements = [...SAMPLE_MOVEMENTS];
    saveData(STORAGE_KEYS.movements, movements);
}

function getCategoryById(id) {
    return categories.find((category) => category.id === id) || { name: 'Sem Categoria', icon: '❓' };
}

function getProductById(id) {
    return products.find((product) => product.id === id);
}

function getStockStatus(product) {
    if (product.quantity === 0) return { label: 'Sem Estoque', className: 'badge-empty', level: 'empty' };
    if (product.quantity <= Math.floor(product.minStock * 0.3)) return { label: 'Crítico', className: 'badge-critical', level: 'critical' };
    if (product.quantity <= product.minStock) return { label: 'Baixo', className: 'badge-low', level: 'low' };
    return { label: 'OK', className: 'badge-ok', level: 'ok' };
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
}

function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function isToday(isoString) {
    const date = new Date(isoString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

function updateCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) dateElement.textContent = new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function updateBreadcrumb(page) {
    const breadcrumbPage = document.getElementById('breadcrumb-page');
    const titles = {
        dashboard: 'Dashboard',
        products: 'Produtos',
        movements: 'Movimentações',
        categories: 'Categorias',
        reports: 'Relatórios',
    };
    if (breadcrumbPage) breadcrumbPage.textContent = titles[page] || 'Dashboard';
}

function setActivePage(page) {
    document.querySelectorAll('.page').forEach((section) => {
        section.classList.toggle('active', section.id === `page-${page}`);
    });
    document.querySelectorAll('.nav-item').forEach((item) => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    updateBreadcrumb(page);
    renderDashboard();
    renderProducts();
    renderMovements();
    renderCategories();
    renderReports();
}

function renderCategoryFilters() {
    const filterSelect = document.getElementById('product-filter-category');
    const productSelect = document.getElementById('product-category');
    const movementProductSelect = document.getElementById('movement-product');

    if (!filterSelect || !productSelect || !movementProductSelect) return;

    const categoryOptions = categories.map((category) => `<option value="${category.id}">${category.name}</option>`).join('');
    filterSelect.innerHTML = `<option value="">Todas Categorias</option>${categoryOptions}`;
    productSelect.innerHTML = `<option value="">Selecione a categoria</option>${categoryOptions}`;
    movementProductSelect.innerHTML = `<option value="">Selecione o produto</option>${products.map((product) => `<option value="${product.id}">${product.name}</option>`).join('')}`;
}

function renderDashboard() {
    const totalProducts = products.length;
    const stockValue = products.reduce((sum, product) => sum + product.salePrice * product.quantity, 0);
    const lowStock = products.filter((product) => product.quantity <= product.minStock).length;
    const movementsToday = movements.filter((movement) => isToday(movement.date)).length;

    document.getElementById('kpi-total-products').textContent = totalProducts;
    document.getElementById('kpi-stock-value').textContent = formatCurrency(stockValue);
    document.getElementById('kpi-low-stock').textContent = lowStock;
    document.getElementById('kpi-movements-today').textContent = movementsToday;

    renderDashboardMovements();
    renderDashboardAlerts();
    renderDashboardTopProducts();
    renderCategoryChart();
    renderNotificationPanel();
}

function renderDashboardMovements() {
    const body = document.getElementById('dashboard-movements-body');
    if (!body) return;
    const recent = [...movements].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    if (recent.length === 0) {
        body.innerHTML = `<tr class="empty-row"><td colspan="4"><div class="empty-state-sm"><i class="fa-solid fa-inbox"></i> Nenhuma movimentação</div></td></tr>`;
        return;
    }
    body.innerHTML = recent.map((movement) => {
        const product = getProductById(movement.productId);
        return `<tr>
            <td>${product ? product.name : 'Produto não encontrado'}</td>
            <td>${movement.type === 'entry' ? 'Entrada' : 'Saída'}</td>
            <td>${movement.quantity}</td>
            <td>${formatDateTime(movement.date)}</td>
        </tr>`;
    }).join('');
}

function renderDashboardAlerts() {
    const container = document.getElementById('dashboard-alerts');
    if (!container) return;
    const lowProducts = products.filter((product) => product.quantity <= product.minStock);
    if (lowProducts.length === 0) {
        container.innerHTML = `<div class="alert-empty"><i class="fa-solid fa-circle-check"></i><span>Estoque adequado</span></div>`;
        return;
    }
    container.innerHTML = lowProducts.slice(0, 5).map((product) => {
        return `<div class="alert-item"><span>${product.name}</span><strong>${product.quantity} em estoque</strong></div>`;
    }).join('');
}

function renderDashboardTopProducts() {
    const container = document.getElementById('top-products-list');
    if (!container) return;
    const sorted = [...products].sort((a, b) => (b.salePrice * b.quantity) - (a.salePrice * a.quantity)).slice(0, 5);
    if (sorted.length === 0) {
        container.innerHTML = `<div class="chart-empty"><i class="fa-solid fa-ranking-star"></i><span>Cadastre produtos</span></div>`;
        return;
    }
    container.innerHTML = sorted.map((product) => `<div class="top-product-item"><span>${product.name}</span><strong>${formatCurrency(product.salePrice * product.quantity)}</strong></div>`).join('');
}

function renderCategoryChart() {
    const chart = document.getElementById('category-chart');
    if (!chart) return;
    const totals = categories.map((category) => {
        const value = products.filter((product) => product.categoryId === category.id).reduce((sum, product) => sum + product.salePrice * product.quantity, 0);
        return { ...category, value };
    }).sort((a, b) => b.value - a.value);
    if (totals.every((item) => item.value === 0)) {
        chart.innerHTML = `<div class="chart-empty"><i class="fa-solid fa-chart-pie"></i><span>Cadastre produtos</span></div>`;
        return;
    }
    const maxValue = Math.max(...totals.map((item) => item.value));
    chart.innerHTML = totals.map((item) => {
        const width = maxValue > 0 ? Math.max(12, Math.round((item.value / maxValue) * 100)) : 0;
        return `<div class="chart-bar"><span class="label">${item.icon} ${item.name}</span><div class="bar" style="width: ${width}%; background-color: ${item.color};"></div><span class="value">${formatCurrency(item.value)}</span></div>`;
    }).join('');
}

function renderNotificationPanel() {
    const badge = document.getElementById('notification-badge');
    const list = document.getElementById('notification-list');
    if (!badge || !list) return;
    const lowProducts = products.filter((product) => product.quantity <= product.minStock);
    badge.textContent = lowProducts.length;
    if (lowProducts.length === 0) {
        list.innerHTML = `<div class="notification-empty">Sem alertas de estoque</div>`;
        return;
    }
    list.innerHTML = lowProducts.map((product) => `<div class="notification-item"><strong>${product.name}</strong> possui apenas ${product.quantity} unidades restantes.</div>`).join('');
}

function renderProducts() {
    const body = document.getElementById('products-table-body');
    if (!body) return;
    const search = document.getElementById('product-search')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('product-filter-category')?.value || '';
    const stockFilter = document.getElementById('product-filter-stock')?.value || '';
    const filtered = products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search) || product.brand.toLowerCase().includes(search);
        const matchesCategory = !categoryFilter || product.categoryId === categoryFilter;
        const status = getStockStatus(product).level;
        const matchesStock = !stockFilter || stockFilter === status;
        return matchesSearch && matchesCategory && matchesStock;
    });
    if (filtered.length === 0) {
        body.innerHTML = `<tr class="empty-row"><td colspan="7"><div class="empty-state"><i class="fa-solid fa-boxes-stacked"></i><h3>Nenhum produto encontrado</h3><p>Refine a busca ou cadastre um novo produto.</p></div></td></tr>`;
        return;
    }
    body.innerHTML = filtered.map((product) => {
        const category = getCategoryById(product.categoryId);
        const status = getStockStatus(product);
        return `<tr><td>${product.name}<span class="product-meta">${product.brand} • ${product.volume}</span></td><td>${category.name}</td><td>${formatCurrency(product.purchasePrice)}</td><td>${formatCurrency(product.salePrice)}</td><td>${product.quantity}</td><td><span class="badge ${status.className}">${status.label}</span></td><td class="actions-cell"><button class="btn-icon btn-edit-product" data-id="${product.id}" title="Editar"><i class="fa-solid fa-pen"></i></button><button class="btn-icon btn-delete-product" data-id="${product.id}" title="Excluir"><i class="fa-solid fa-trash"></i></button></td></tr>`;
    }).join('');
}

function renderMovements() {
    const body = document.getElementById('movements-table-body');
    if (!body) return;
    const search = document.getElementById('movement-search')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('movement-filter-type')?.value || '';
    const startDate = document.getElementById('movement-date-start')?.value;
    const endDate = document.getElementById('movement-date-end')?.value;
    const filtered = movements.filter((movement) => {
        const product = getProductById(movement.productId);
        const productName = product ? product.name.toLowerCase() : '';
        const matchesSearch = productName.includes(search) || movement.reason.toLowerCase().includes(search) || movement.notes.toLowerCase().includes(search);
        const matchesType = !typeFilter || movement.type === typeFilter;
        const movementDate = new Date(movement.date);
        const matchesStart = !startDate || movementDate >= new Date(startDate + 'T00:00:00');
        const matchesEnd = !endDate || movementDate <= new Date(endDate + 'T23:59:59');
        return matchesSearch && matchesType && matchesStart && matchesEnd;
    });
    if (filtered.length === 0) {
        body.innerHTML = `<tr class="empty-row"><td colspan="6"><div class="empty-state"><i class="fa-solid fa-arrow-right-arrow-left"></i><h3>Nenhuma movimentação</h3><p>Registre entradas ou saídas para começar.</p></div></td></tr>`;
        return;
    }
    body.innerHTML = filtered.sort((a, b) => new Date(b.date) - new Date(a.date)).map((movement) => {
        const product = getProductById(movement.productId);
        return `<tr><td>${formatDateTime(movement.date)}</td><td>${product ? product.name : 'Produto removido'}</td><td>${movement.type === 'entry' ? 'Entrada' : 'Saída'}</td><td>${movement.quantity}</td><td>${movement.reason}</td><td>${movement.notes || '—'}</td></tr>`;
    }).join('');
}

function renderCategories() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;
    if (categories.length === 0) {
        grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-tags"></i><h3>Nenhuma categoria</h3><p>Adicione sua primeira categoria.</p></div>`;
        return;
    }
    grid.innerHTML = categories.map((category) => {
        const totalProducts = products.filter((product) => product.categoryId === category.id).length;
        return `<div class="category-card" data-id="${category.id}"><div class="category-head"><span class="category-icon" style="background:${category.color}33;color:${category.color};">${category.icon}</span><div><h3>${category.name}</h3><p>${totalProducts} produtos</p></div></div><div class="category-actions"><button class="btn-icon btn-delete-category" data-id="${category.id}" title="Excluir"><i class="fa-solid fa-trash"></i></button></div></div>`;
    }).join('');
}

function renderReports() {
    const valueChart = document.getElementById('report-value-chart');
    const weekChart = document.getElementById('report-week-chart');
    const lowStockBody = document.getElementById('report-low-stock-body');
    const mostMoved = document.getElementById('report-most-moved');
    const summary = document.getElementById('report-summary-stats');
    const valueByCategory = categories.map((category) => {
        const total = products.filter((product) => product.categoryId === category.id).reduce((sum, product) => sum + product.salePrice * product.quantity, 0);
        return { ...category, total };
    }).sort((a, b) => b.total - a.total);
    if (valueChart) {
        valueChart.innerHTML = valueByCategory.slice(0, 5).map((category) => {
            const width = valueByCategory[0] && valueByCategory[0].total > 0 ? Math.max(10, Math.round((category.total / valueByCategory[0].total) * 100)) : 0;
            return `<div class="report-bar"><span>${category.icon} ${category.name}</span><div class="bar" style="width:${width}%"></div><strong>${formatCurrency(category.total)}</strong></div>`;
        }).join('');
    }
    if (weekChart) {
        const counts = Array.from({ length: 7 }).map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            const label = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
            const count = movements.filter((movement) => {
                const movementDate = new Date(movement.date);
                return movementDate.toDateString() === date.toDateString();
            }).length;
            return { label, count };
        });
        weekChart.innerHTML = counts.map((item) => `<div class="week-bar"><span>${item.label}</span><div class="bar" style="height:${Math.max(10, item.count * 10)}px"></div><strong>${item.count}</strong></div>`).join('');
    }
    if (lowStockBody) {
        const lowProducts = products.filter((product) => product.quantity <= product.minStock);
        if (lowProducts.length === 0) {
            lowStockBody.innerHTML = `<tr><td colspan="6" class="empty-row"><div class="empty-state-sm"><i class="fa-solid fa-check-circle"></i> Nenhum produto em atraso</div></td></tr>`;
        } else {
            lowStockBody.innerHTML = lowProducts.map((product) => {
                const category = getCategoryById(product.categoryId);
                const status = getStockStatus(product);
                return `<tr><td>${product.name}</td><td>${category.name}</td><td>${product.quantity}</td><td>${product.minStock}</td><td><span class="badge ${status.className}">${status.label}</span></td><td><button class="btn btn-small btn-edit-product" data-id="${product.id}">Ajustar</button></td></tr>`;
            }).join('');
        }
    }
    if (mostMoved) {
        const counts = products.map((product) => ({ product, count: movements.filter((movement) => movement.productId === product.id).length })).sort((a, b) => b.count - a.count).slice(0, 5);
        mostMoved.innerHTML = counts.map((item) => `<div class="most-moved-item"><span>${item.product.name}</span><strong>${item.count} movimentações</strong></div>`).join('');
    }
    if (summary) {
        const totalInventory = products.reduce((sum, product) => sum + product.quantity, 0);
        const totalCategories = categories.length;
        const movementCount = movements.length;
        summary.innerHTML = `<div class="summary-card"><strong>${formatCurrency(stockValue())}</strong><span>Valor total</span></div><div class="summary-card"><strong>${totalInventory}</strong><span>Itens em estoque</span></div><div class="summary-card"><strong>${movementCount}</strong><span>Movimentações</span></div><div class="summary-card"><strong>${totalCategories}</strong><span>Categorias</span></div>`;
    }
}

function stockValue() {
    return products.reduce((sum, product) => sum + product.salePrice * product.quantity, 0);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const iconMap = {
        success: 'fa-solid fa-circle-check',
        error: 'fa-solid fa-circle-xmark',
        warning: 'fa-solid fa-triangle-exclamation',
        info: 'fa-solid fa-circle-info',
    };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="${iconMap[type] || iconMap.info}"></i><div>${message}</div>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    document.body.classList.add('modal-open');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove('open');
    document.body.classList.remove('modal-open');
}

function clearProductForm() {
    const fields = ['product-id', 'product-name', 'product-brand', 'product-category', 'product-volume', 'product-purchase-price', 'product-sale-price', 'product-min-stock', 'product-quantity', 'product-supplier', 'product-sku', 'product-expiry-date', 'product-description'];
    fields.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = '';
            }
        }
    });
    document.getElementById('product-quantity').value = '0';
    document.getElementById('product-category').value = categories[0]?.id || '';
    document.getElementById('product-modal-title').textContent = 'Novo Produto';
}

function toggleSidebar() {
    document.body.classList.toggle('sidebar-collapsed');
    document.querySelector('.sidebar')?.classList.toggle('collapsed');
}

function performGlobalSearch() {
    const query = document.getElementById('global-search')?.value.trim() || '';
    if (!query) return;
    setActivePage('products');
    const productSearch = document.getElementById('product-search');
    if (productSearch) {
        productSearch.value = query;
        renderProducts();
        productSearch.focus();
    }
}

function openProductModal(productId) {
    clearProductForm();
    if (productId) {
        const product = getProductById(productId);
        if (!product) return;
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-brand').value = product.brand;
        document.getElementById('product-category').value = product.categoryId;
        document.getElementById('product-volume').value = product.volume;
        document.getElementById('product-purchase-price').value = product.purchasePrice;
        document.getElementById('product-sale-price').value = product.salePrice;
        document.getElementById('product-min-stock').value = product.minStock;
        document.getElementById('product-quantity').value = product.quantity;
        document.getElementById('product-supplier').value = product.supplier;
        document.getElementById('product-sku').value = product.sku || '';
        document.getElementById('product-expiry-date').value = product.expiryDate || '';
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-modal-title').textContent = 'Editar Produto';
    }
    openModal('product-modal');
}

function clearCategoryForm() {
    document.getElementById('category-id').value = '';
    document.getElementById('category-name').value = '';
    document.getElementById('category-icon').value = '';
    document.getElementById('category-color').value = '#e8a33d';
    document.getElementById('category-modal-title').textContent = 'Nova Categoria';
}

function openCategoryModal() {
    clearCategoryForm();
    openModal('category-modal');
}

function openMovementModal(type) {
    const title = document.getElementById('movement-modal-title');
    const header = document.getElementById('movement-modal-header');
    const hiddenType = document.getElementById('movement-type');
    const reason = document.getElementById('movement-reason');
    if (!title || !header || !hiddenType || !reason) return;
    hiddenType.value = type;
    title.textContent = type === 'entry' ? 'Nova Entrada' : 'Nova Saída';
    hiddenType.value = type;
    reason.innerHTML = type === 'entry'
        ? '<option value="Compra de fornecedor">Compra de fornecedor</option><option value="Devolução de cliente">Devolução de cliente</option><option value="Ajuste de inventário">Ajuste de inventário</option>'
        : '<option value="Venda">Venda</option><option value="Quebra/Avaria">Quebra/Avaria</option><option value="Consumo interno">Consumo interno</option><option value="Vencimento">Vencimento</option>';
    document.getElementById('movement-product').value = products[0]?.id || '';
    document.getElementById('movement-quantity').value = '1';
    document.getElementById('movement-notes').value = '';
    openModal('movement-modal');
}

function deleteProduct(productId) {
    const product = getProductById(productId);
    if (!product) return;
    const movementCount = movements.filter((movement) => movement.productId === productId).length;
    if (movementCount > 0) {
        showToast(`Não é possível excluir "${product.name}" — existem ${movementCount} movimentação(ões) associadas.`, 'error');
        return;
    }
    products = products.filter((product) => product.id !== productId);
    saveData(STORAGE_KEYS.products, products);
    renderProducts();
    renderDashboard();
    renderReports();
    renderCategoryFilters();
    showToast(`Produto "${product.name}" excluído.`, 'warning');
}

function deleteCategory(categoryId) {
    const hasProducts = products.some((product) => product.categoryId === categoryId);
    if (hasProducts) {
        showToast('Remova todos os produtos desta categoria primeiro!', 'error');
        return;
    }
    categories = categories.filter((category) => category.id !== categoryId);
    saveData(STORAGE_KEYS.categories, categories);
    renderCategoryFilters();
    renderCategories();
    renderDashboard();
    showToast('Categoria excluída.', 'warning');
}

function exportProductsCsv() {
    const rows = [['Produto','Categoria','Marca','Volume','Quantidade','Preço Venda','Status']];
    products.forEach((product) => {
        const category = getCategoryById(product.categoryId);
        rows.push([
            product.name,
            category.name,
            product.brand,
            product.volume,
            product.quantity,
            product.salePrice.toFixed(2),
            getStockStatus(product).label,
        ]);
    });
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bevstock_produtos.csv';
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    link.remove();
}

function bindEvents() {
    document.querySelectorAll('.nav-item').forEach((item) => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const page = item.dataset.page;
            if (page) setActivePage(page);
            document.querySelector('.sidebar')?.classList.remove('mobile-open');
        });
    });
    document.querySelectorAll('[data-goto]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const target = link.dataset.goto;
            if (target) setActivePage(target);
        });
    });
    document.getElementById('sidebar-toggle')?.addEventListener('click', toggleSidebar);
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => document.querySelector('.sidebar')?.classList.toggle('mobile-open'));
    document.getElementById('global-search')?.addEventListener('input', performGlobalSearch);
    document.querySelectorAll('.modal').forEach((modal) => {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) closeModal(modal.id);
        });
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.open').forEach((modal) => closeModal(modal.id));
        }
    });
    document.getElementById('btn-add-product')?.addEventListener('click', () => openProductModal());
    document.getElementById('btn-add-category')?.addEventListener('click', openCategoryModal);
    document.getElementById('btn-new-entry')?.addEventListener('click', () => openMovementModal('entry'));
    document.getElementById('btn-new-exit')?.addEventListener('click', () => openMovementModal('exit'));
    document.getElementById('btn-export-csv')?.addEventListener('click', exportProductsCsv);
    document.querySelectorAll('.modal-close-btn, .modal-cancel').forEach((button) => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            if (modalId) closeModal(modalId);
        });
    });
    document.getElementById('product-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = document.getElementById('product-id').value;
        const name = document.getElementById('product-name').value.trim();
        const brand = document.getElementById('product-brand').value.trim();
        const categoryId = document.getElementById('product-category').value;
        const volume = document.getElementById('product-volume').value.trim();
        const purchasePrice = parseFloat(document.getElementById('product-purchase-price').value) || 0;
        const salePrice = parseFloat(document.getElementById('product-sale-price').value) || 0;
        const minStock = parseInt(document.getElementById('product-min-stock').value, 10) || 0;
        const quantity = parseInt(document.getElementById('product-quantity').value, 10) || 0;
        const supplier = document.getElementById('product-supplier').value.trim();
        const sku = document.getElementById('product-sku').value.trim();
        const expiryDate = document.getElementById('product-expiry-date').value;
        const description = document.getElementById('product-description').value.trim();
        if (!name || !categoryId || !volume || purchasePrice < 0 || salePrice < 0 || minStock < 0) {
            showToast('Preencha os campos obrigatórios corretamente.', 'error');
            return;
        }
        if (id) {
            const product = getProductById(id);
            if (product) {
                product.name = name;
                product.brand = brand;
                product.categoryId = categoryId;
                product.volume = volume;
                product.purchasePrice = purchasePrice;
                product.salePrice = salePrice;
                product.minStock = minStock;
                product.quantity = quantity;
                product.supplier = supplier;
                product.sku = sku;
                product.expiryDate = expiryDate;
                product.description = description;
                saveData(STORAGE_KEYS.products, products);
                showToast('Produto atualizado com sucesso.', 'success');
            }
        } else {
            const newProduct = { id: generateId('prod'), name, brand, categoryId, volume, purchasePrice, salePrice, minStock, quantity, supplier, sku, expiryDate, description };
            products.unshift(newProduct);
            saveData(STORAGE_KEYS.products, products);
            showToast('Produto cadastrado com sucesso.', 'success');
        }
        closeModal('product-modal');
        renderProducts();
        renderDashboard();
        renderReports();
        renderCategoryFilters();
    });
    document.getElementById('category-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = document.getElementById('category-id').value;
        const name = document.getElementById('category-name').value.trim();
        const icon = document.getElementById('category-icon').value.trim() || '🏷️';
        const color = document.getElementById('category-color').value;
        if (!name) {
            showToast('Informe o nome da categoria.', 'error');
            return;
        }
        if (id) {
            const category = getCategoryById(id);
            if (category) {
                category.name = name;
                category.icon = icon;
                category.color = color;
                showToast('Categoria atualizada.', 'success');
            }
        } else {
            categories.unshift({ id: generateId('cat'), name, icon, color });
            showToast('Categoria adicionada.', 'success');
        }
        saveData(STORAGE_KEYS.categories, categories);
        closeModal('category-modal');
        renderCategoryFilters();
        renderCategories();
        renderDashboard();
    });
    document.getElementById('movement-form')?.addEventListener('submit', (event) => {
        event.preventDefault();
        const type = document.getElementById('movement-type').value;
        const productId = document.getElementById('movement-product').value;
        const quantity = parseInt(document.getElementById('movement-quantity').value, 10) || 0;
        const reason = document.getElementById('movement-reason').value.trim();
        const notes = document.getElementById('movement-notes').value.trim();
        if (!productId || quantity <= 0 || !reason) {
            showToast('Preencha os campos obrigatórios da movimentação.', 'error');
            return;
        }
        const product = getProductById(productId);
        if (!product) {
            showToast('Produto não encontrado.', 'error');
            return;
        }
        const newMovement = { id: generateId('mov'), productId, type, quantity, reason, notes, date: new Date().toISOString() };
        movements.unshift(newMovement);
        if (type === 'entry') {
            product.quantity += quantity;
        } else {
            product.quantity = Math.max(0, product.quantity - quantity);
        }
        saveData(STORAGE_KEYS.movements, movements);
        saveData(STORAGE_KEYS.products, products);
        closeModal('movement-modal');
        showToast(`Movimentação de ${type === 'entry' ? 'entrada' : 'saída'} registrada.`, 'success');
        renderMovements();
        renderProducts();
        renderDashboard();
        renderReports();
    });
    document.getElementById('product-search')?.addEventListener('input', renderProducts);
    document.getElementById('product-filter-category')?.addEventListener('change', renderProducts);
    document.getElementById('product-filter-stock')?.addEventListener('change', renderProducts);
    document.getElementById('movement-search')?.addEventListener('input', renderMovements);
    document.getElementById('movement-filter-type')?.addEventListener('change', renderMovements);
    document.getElementById('movement-date-start')?.addEventListener('change', renderMovements);
    document.getElementById('movement-date-end')?.addEventListener('change', renderMovements);
    document.getElementById('notification-btn')?.addEventListener('click', () => {
        document.getElementById('notification-panel')?.classList.toggle('open');
    });
    document.getElementById('close-notifications')?.addEventListener('click', () => {
        document.getElementById('notification-panel')?.classList.remove('open');
    });
    document.getElementById('products-table-body')?.addEventListener('click', (event) => {
        const target = event.target.closest('button');
        if (!target) return;
        const productId = target.dataset.id;
        if (!productId) return;
        if (target.classList.contains('btn-edit-product')) {
            openProductModal(productId);
        }
        if (target.classList.contains('btn-delete-product')) {
            if (confirm('Tem certeza que deseja excluir este produto?')) {
                deleteProduct(productId);
            }
        }
    });
    document.getElementById('report-low-stock-body')?.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        const productId = button.dataset.id;
        if (!productId) return;
        openProductModal(productId);
    });
    document.getElementById('categories-grid')?.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        const categoryId = button.dataset.id;
        if (button.classList.contains('btn-delete-category')) {
            if (confirm('Tem certeza que deseja excluir esta categoria?')) {
                deleteCategory(categoryId);
            }
        }
    });
}

function init() {
    updateCurrentDate();
    renderCategoryFilters();
    setActivePage('dashboard');
    bindEvents();
}

document.addEventListener('DOMContentLoaded', init);
