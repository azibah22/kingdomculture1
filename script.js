// Product Data
const products = [
    {
        id: 1,
        title: "Culture Classic Tee",
        category: "T-Shirts",
        price: 29.99,
        oldPrice: 39.99,
        image: "images/shirt1.png",
        badge: "Bestseller",
        colors: ["Black", "White", "Gray"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 2,
        title: "Urban Vibes Cap",
        category: "Caps",
        price: 24.99,
        oldPrice: 29.99,
        image: "images/cap1.png",
        badge: "New",
        colors: ["Black", "Navy", "Khaki"],
        sizes: ["One Size"]
    },
    {
        id: 3,
        title: "Street Sleeveless",
        category: "Sleeveless",
        price: 34.99,
        oldPrice: 44.99,
        image: "images/shirt2.png",
        badge: "Sale",
        colors: ["Black", "Red", "Army Green"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 4,
        title: "Minimalist Tee",
        category: "T-Shirts",
        price: 27.99,
        image: "images/products/tshirt2.jpg",
        colors: ["White", "Gray", "Beige"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 5,
        title: "Classic Crop Top",
        category: "Crop Tops",
        price: 24.99,
        image: "images/crop1.png",
        badge: "New",
        colors: ["Black", "White", "Pink"],
        sizes: ["XS", "S", "M"]
    },
    {
        id: 6,
        title: "Sporty Crop Top",
        category: "Crop Tops",
        price: 29.99,
        oldPrice: 34.99,
        image: "images/crop2.png",
        badge: "Sale",
        colors: ["Gray", "Navy", "Purple"],
        sizes: ["XS", "S", "M"]
    },
    {
        id: 7,
        title: "Designer Crop Top",
        category: "Crop Tops",
        price: 32.99,
        image: "images/crop3.png",
        colors: ["Black", "Red", "Blue"],
        sizes: ["XS", "S", "M"]
    },
    {
        id: 8,
        title: "Urban Street Hoodie",
        category: "Hoodies",
        price: 49.99,
        image: "images/hoodie1.png",
        badge: "New",
        colors: ["Black", "Gray", "Navy"],
        sizes: ["S", "M", "L", "XL"]
    },
    {
        id: 9,
        title: "Premium Denim Jacket",
        category: "Jackets",
        price: 79.99,
        image: "images/jacket1.png",
        badge: "New",
        colors: ["Blue", "Black"],
        sizes: ["S", "M", "L", "XL"]
    }
];

// Cart Data
let cart = [];

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartCount = document.querySelector('.cart-count');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total span');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const cartIcon = document.querySelector('.cart-icon');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenuBtn = document.querySelector('.close-menu');

// Filter Products by Category
function filterProductsByCategory(category) {
    let filteredProducts;
    if (category === 'all') {
        filteredProducts = products;
    } else if (category === 'new-arrivals') {
        filteredProducts = products.filter(product => product.badge === 'New');
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    displayProducts(filteredProducts);
}

// Display Products
function displayProducts(productsToDisplay = products) {
    productGrid.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button><i class="far fa-heart"></i></button>
                    <button><i class="fas fa-search"></i></button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to Cart
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showCartNotification(product.title);
}

// Update Cart
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.title}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="remove-item" data-id="${item.id}">
                <i class="fas fa-times"></i>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Decrease Quantity
function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

// Increase Quantity
function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    updateCart();
}

// Remove Item
function removeItem(e) {
    const productId = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Show Cart Notification
function showCartNotification(productTitle) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <p>${productTitle} added to cart</p>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Toggle Cart
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : 'auto';
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
}

// Search Functionality
function searchProducts(query) {
    query = query.toLowerCase().trim();
    console.log('Searching for:', query); // Debug log

    if (!query) {
        displayProducts();
        return;
    }

    const searchResults = products.filter(product => {
        const matches = 
            product.title.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.colors.some(color => color.toLowerCase().includes(query)) ||
            product.sizes.some(size => size.toLowerCase().includes(query)) ||
            product.price.toString().includes(query);

        console.log('Product:', product.title, 'Matches:', matches); // Debug log
        return matches;
    });

    console.log('Search results:', searchResults.length); // Debug log
    displayProducts(searchResults);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // Search Box Event Listener
    const searchBox = document.querySelector('.search-box input');
    const searchIcon = document.querySelector('.search-box i');
    
    if (searchBox && searchIcon) {
        // Real-time search as you type
        searchBox.addEventListener('input', (e) => {
            searchProducts(e.target.value);
        });
        
        // Search on icon click
        searchIcon.addEventListener('click', () => {
            searchProducts(searchBox.value);
        });
        
        // Search on Enter key
        searchBox.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchProducts(searchBox.value);
            }
        });
    } else {
        console.error('Search elements not found'); // Debug log
    }
    
    // Category Links Click Events
    document.querySelectorAll('a[href^="#tshirts"], a[href^="#caps"], a[href^="#sleeveless"], a[href^="#crop-tops"], a[href^="#all-products"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.closest('a').getAttribute('href').replace('#', '');
            const categoryMap = {
                'tshirts': 'T-Shirts',
                'caps': 'Caps',
                'sleeveless': 'Sleeveless',
                'crop-tops': 'Crop Tops',
                'all-products': 'all'
            };
            filterProductsByCategory(categoryMap[category]);
        });
    });
    
    // Cart Icon Click
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCart();
    });
    
    // Close Cart
    closeCartBtn.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    
    // Mobile Menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    closeMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Prevent body scroll when mobile menu is open
    mobileMenu.addEventListener('touchmove', (e) => {
        if (mobileMenu.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });
});

// Add cart notification styles
const style = document.createElement('style');
style.textContent = `
    .cart-notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary);
        color: var(--white);
        padding: 15px 30px;
        border-radius: 4px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1003;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .cart-notification.show {
        opacity: 1;
    }
`;
document.head.appendChild(style);