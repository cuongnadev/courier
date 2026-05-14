import type { Collection } from "@/features/collections/types/collection.type";

export const collections: Collection[] = [
    {
        id: "auth",
        name: "User Authentication API",
        color: "#3B82F6",
        requests: [
            {
                id: "login",
                method: "POST",
                name: "User Login",
                path: "/collections/auth/login",
            },
            {
                id: "profile",
                method: "GET",
                name: "Get User Profile",
                path: "/collections/auth/profile",
            },
            {
                id: "refresh",
                method: "POST",
                name: "Refresh Token",
                path: "/collections/auth/refresh",
            },
        ],
    },
    {
        id: "products",
        name: "E-Commerce Products",
        color: "#10B981",
        requests: [
            {
                id: "get-products",
                method: "GET",
                name: "Get Products",
                path: "/collections/products",
            },
            {
                id: "create-product",
                method: "POST",
                name: "Create Product",
                path: "/collections/products/create",
            },
        ],
    },
    {
        id: "payment",
        name: "Payment Gateway",
        color: "#F59E0B",
        requests: [
            {
                id: "create-payment",
                method: "POST",
                name: "Create Payment",
                path: "/collections/payment/create",
            },
        ],
    },
];