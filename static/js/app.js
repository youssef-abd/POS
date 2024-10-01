function posApp() {
    return {
        tickets: [],
        cart: [],
        categories: ["Tous", "Exposition", "Concert", "Visite", "Atelier", "Cinéma", "Conférence"],
        selectedCategory: "Tous",
        searchQuery: "",
        filteredTickets: [],
        amountGiven: 0,
        change: 0,
        showCategories: false,
        isCashInput: false, // Ajouter cette ligne
       
        initApp() {
            this.loadTickets();
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
                this.updateTicketQuantities();
            }
 

            window.addEventListener('beforeunload', () => {
                localStorage.removeItem('cart');
            });
        },
        logout() {
            localStorage.removeItem('authenticated');
            window.location.href = 'login.html'; // Rediriger vers la page de connexion
        },
        loadTickets() {
            fetch('http://localhost:4000/api/tickets')
                .then(response => response.json())
                .then(data => {
                    this.tickets = data;
                })
                .catch(error => {
                    console.error('Erreur lors du chargement des tickets :', error);
                });
        },

        selectCategory(category) {
            this.selectedCategory = category;
        },
        toggleCategories() {
            console.log('Button clicked'); // Log to check if the function is called
            this.showCategories = !this.showCategories;
        },

        get filteredTickets() {
            return this.tickets.filter(ticket =>
                (this.selectedCategory === "Tous" || ticket.category === this.selectedCategory) &&
                ticket.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },

        incrementTicket(ticket) {
            ticket.quantity++;
            this.saveCart();
        },

        decrementTicket(ticket) {
            if (ticket.quantity > 0) {
                ticket.quantity--;
                if (ticket.quantity === 0) {
                    this.removeFromCart(ticket);
                } else {
                    this.saveCart();
                }
            }
        },

        addToCart(ticket) {
            const existingItem = this.cart.find(item => item.id === ticket.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                this.cart.push({ ...ticket, quantity: 1 });
            }
            this.saveCart();
        },

        removeFromCart(item) {
            const index = this.cart.findIndex(cartItem => cartItem.id === item.id);
            if (index !== -1) {
                this.cart.splice(index, 1);
            }
            this.saveCart();
        },

        updateTicketQuantities() {
            const validCartItems = this.cart.filter(item => item.quantity > 0);
            this.cart = validCartItems;
            this.tickets.forEach(ticket => {
                const cartItem = this.cart.find(item => item.id === ticket.id);
                ticket.quantity = cartItem ? cartItem.quantity : 0;
            });
            this.saveCart();
        },

        getTotal() {
            return this.cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
        },

        get cartCount() {
            return this.cart.reduce((count, item) => count + item.quantity, 0);
        },

        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },

        handleCashPayment(amountGiven) {
            this.amountGiven = parseFloat(amountGiven);
            const total = parseFloat(this.getTotal());
            this.change = this.amountGiven - total;
            if (this.change < 0) {
                alert("Le montant donné est insuffisant !");
                return;
            }
            this.checkout("Cash");
        },

        processCashPayment() {
            this.handleCashPayment(this.amountGiven);
            this.isCashInput = false; // Réinitialiser l'état après traitement
        },

        
        checkoutCash() {
            this.isCashInput = !this.isCashInput; // Alterner entre le bouton et le champ de saisie
        },

        checkoutCard() {
            this.checkout("Card");
        },

        checkoutEWallet() {
            this.checkout("E-Wallet");
        },

        checkout(paymentMethod) {
            if (this.cart.length === 0) {
                alert("Votre panier est vide !");
                return;
            }
            const auth_code = localStorage.getItem('auth_code');
            // Préparer les détails du reçu pour affichage
            const receiptDetails = `
                <div class="list-group list-group-flush">
                    ${this.cart.map(item => `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6>${item.name}</h6>
                                    <small>${item.quantity} x ${item.price.toFixed(2)} €</small>
                                </div>
                                <span>${(item.quantity * item.price).toFixed(2)} €</span>
                            </div>
                        </div>
                    `).join('')}
                    <div class="list-group-item">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>Total</strong>
                            </div>
                            <strong>${this.getTotal()} €</strong>
                        </div>
                    </div>
                    ${paymentMethod === "Cash" ? `
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>Montant donné par le client</strong>
                                </div>
                                <strong>${this.amountGiven.toFixed(2)} €</strong>
                            </div>
                        </div>
                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>Monnaie rendu</strong>
                                </div>
                                <strong>${this.change.toFixed(2)} €</strong>
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;

            // Stocker les détails du reçu dans localStorage pour la page de reçu
            localStorage.setItem('receiptDetails', receiptDetails);
            
            // Sauvegarder la méthode de paiement pour le reçu
            localStorage.setItem('paymentMethod', paymentMethod); 
           
            // Envoyer les informations de la transaction au backend
            fetch('http://localhost:4000/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentMethod: paymentMethod,
                    total: this.getTotal(),
                    cart: this.cart,
                    auth_code: auth_code
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la transaction');
                }
                return response.json();
            })
            .then(data => {
                console.log('Transaction réussie:', data);
                this.cart = [];
                this.saveCart();
                window.location.href = 'receipt.html'; // Redirection vers le reçu
            })
            .catch(error => {
                console.error('Erreur lors de la transaction:', error);
            });
        }
    };
}
