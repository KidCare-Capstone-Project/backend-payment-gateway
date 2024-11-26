const express = require('express');
const bodyParser = require('body-parser');
const midtransClient = require('midtrans-client');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const MIDTRANS_SERVER_KEY = 'SB-Mid-server-eDkWE8kJx9tAF_tIf-CuMK8d';
const MIDTRANS_CLIENT_KEY = 'SB-Mid-client-bKs9hY7uAp9mKb-h';

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY
});

app.post('/generate-snap-token', async (req, res) => {
    const { order_id, gross_amount, item_details, customer_details } = req.body;

    if (!order_id || !gross_amount || !item_details || !customer_details) {
        return res.status(400).json({
            message: 'Field yang diperlukan tidak lengkap'
        });
    }

    const parameter = {
        transaction_details: {
            order_id: order_id,
            gross_amount: gross_amount
        },
        item_details: item_details,
        customer_details: customer_details
    };

    try {
        const transaction = await snap.createTransaction(parameter);
        const snapToken = transaction.token;

        res.json({
            snapToken: snapToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Gagal menghasilkan Snap Token',
            error: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan pada http://localhost:${port}`);
});
