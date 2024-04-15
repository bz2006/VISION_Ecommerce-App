import Cart from "../models/cartModel.js";


// Create or update a cart
export const createOrUpdateCart = async (req, res) => {
    try {
        const userId = req.params.id; // User ID
        const { items } = req.body; // Cart items
        

        // Find the cart for the user
        let cart = await Cart.findOne({ user: userId });

        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = new Cart({
                user: userId,
                item:req.body.items
                
            });
        } else {
            // If cart exists, update it with the new items
            cart.items = items;
        }

        // Save the cart to the database
        await cart.save();

        // Respond with the updated or created cart
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




// Delete a cart
export const deleteCart = async (req, res) => {
    try {
        const { userId } = req.params; // Assuming userId is passed as a parameter

        // Find the cart associated with the userId and delete it
        const deletedCart = await Cart.findOneAndDelete({ userId });

        if (!deletedCart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Get carts by user ID
export const getCartsByUserId = async (req, res) => {
    try {
        const userId = req.params.id;

        // Find carts with the given user ID and project only the 'items' field, excluding the '_id' field
        const carts = await Cart.find({ user: userId }, { items: 1, _id: 0 });

        if (!carts) {
            return res.status(404).json({ error: 'Carts not found' });
        }

        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

