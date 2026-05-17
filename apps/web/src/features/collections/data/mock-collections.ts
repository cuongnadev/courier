import type { CollectionResponse } from "@/features/collections/types/collection.type";

export const collections: CollectionResponse[] = [
    {
        id: "auth",
        name: "User Authentication API",
        variant: "blue",
        requests: [
            {
                id: "login",
                method: "POST",
                name: "User Login",
                uri: "/collections/auth/login",
            },
            {
                id: "profile",
                method: "GET",
                name: "Get User Profile",
                uri: "/collections/auth/profile",
            },
            {
                id: "refresh",
                method: "POST",
                name: "Refresh Token",
                uri: "/collections/auth/refresh",
            },
        ],
    },
    {
        id: "products",
        name: "E-Commerce Products",
        variant: "green",
        requests: [
            {
                id: "get-products",
                method: "GET",
                name: "Get Products",
                uri: "/collections/products",
            },
            {
                id: "create-product",
                method: "POST",
                name: "Create Product",
                uri: "/collections/products/create",
            },
        ],
    },
    {
        id: "payment",
        name: "Payment Gateway",
        variant: "orange",
        requests: [
            {
                id: "create-payment",
                method: "POST",
                name: "Create Payment",
                uri: "/collections/payment/create",
            },
        ],
    },
];