import {create} from "zustand"



export const loadingStore = create((set)=>{
    return {
        isLoading : false,
        setIsLoading: (param)=>{
            set({isLoading:param})
        }
    }
})

export const userStore = create((set)=>{
    return {
        user: JSON.parse(localStorage.getItem("User")) || null,

        /*sets the user & token to store and local storage*/
        setUser: ((user,token)=>{
             set(()=>{
                 localStorage.setItem("User", JSON.stringify(user));
                 localStorage.setItem("Token",token)
               return {
                   user:user
               }
           })
        }),
        updateUser: ((user)=>{
            set(()=>{
                localStorage.setItem("User", JSON.stringify(user));
                return {
                    user:user
                }
            })
        }),

        /*removes the user & token from store and local Storage*/
        logoutUser: ()=>{
             set(()=>{
                localStorage.removeItem('User')
                localStorage.removeItem('Token')
                return {
                    user:null
                }
            })
        }
    }
})


export const productStore = create((set)=>{
    return {
        product: [],
        setProduct: (products)=>{
            set({product: products})
        },

        removeProduct: (id)=>{
            set((state)=>{
                const filtered = state.product.filter((prod)=>{
                    return prod['id'] !== id
                })
                return {product:filtered}
            })
        },


        category: [],
        setCategory: (category)=>{
            set({category: category})
        },
        removeCategory: (id)=>{
            set((state)=>{
                const filtered = state.category.filter((cate)=>{
                    return cate['id'] !== id
                })
                return {category:filtered}
            })
        },


        brand: [],
        setBrand: (brand)=>{
            set({brand: brand})
        },
        removeBrand: (id)=>{
            set((state)=>{
                const filtered = state.brand.filter((prod)=>{
                    return prod['id'] !== id
                })
                return {brand:filtered}
            })
        },



        filterProduct: [],
        setFilteredProduct: (column,param)=>{
           set((state)=>{
               const filtered = state.product.filter((prod)=>{
                   return prod[column] == param
               })
               return {filterProduct:filtered}
           })
        },

        discountProduct: [],
        setDiscountProduct: ()=>{
            set((state)=>{
                const filtered = state.product.filter((prod)=>{
                    return prod.status == 'Discount'
                })
                return {discountProduct:filtered}
            })
        },

        recommendedProduct: [],
        setRecommendedProduct: ()=>{
            set((state)=>{
                const filtered = state.product.filter((prod)=>{
                    return prod.status == 'Hot'
                })
                return {recommendedProduct:filtered}
            })
        },

        limitedProduct: [],
        setLimitedProduct: ()=>{
            set((state)=>{
                const filtered = state.product.filter((prod)=>{
                    return prod.status == 'Out_of_Stock'
                })
                return {limitedProduct:filtered}
            })
        },






    }
})


export const cartStore = create((set)=>{
    return {
        cart:[],
        setCart: (carts)=>{
            set({cart:carts})
        },
        addCart: (product) => {
            set((state) => {
                const existingItem = state.cart.find((item) => item.product.id === product.id);

                let updatedCart;

                if (existingItem) {
                    // Increase quantity if item already exists
                    updatedCart = state.cart.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: Number(item.quantity) + 1 }
                            : item
                    );
                } else {
                    // Add new item
                    updatedCart = [
                        ...state.cart,
                        {
                            product: product,
                            product_id: product.id,
                            quantity: 1,
                        },
                    ];
                }

                // Calculate total price from the updated cart
                const totalPrice = updatedCart.reduce((sum, item) => {
                    return sum + parseFloat(item.product.price) * parseFloat(item.quantity);
                }, 0);

                return {
                    cart: updatedCart,
                    totalPrice: totalPrice,        // ← Now correctly calculated
                };
            });
        },
        updateQuantity: ((id,quantity)=>{
            set((state)=>{

                const newQuantity = Number(quantity);

                // Prevent invalid or zero quantities
                if (isNaN(newQuantity) || newQuantity < 1) {
                    return state; // or handle error
                }

                const updatedCart = state.cart.map((item)=>{
                    return item.product.id === id ? {...item, quantity:newQuantity} : item
                }).filter((item)=>item.quantity>0)
                const total = updatedCart.reduce((price,item)=>{
                    return parseInt(price) + (parseInt(item.product.price)*parseInt(item.quantity))
                },0)

                return {cart: updatedCart, totalPrice:total}


            })
        }),
        removeCartItem: (id)=>{
            set((state)=>{
                const filtered = state.cart.filter(item=>item.product.id !== id)

                const total = filtered.reduce((price,item)=>{
                    return parseFloat(price) + (parseFloat(item.product.price)*parseFloat(item.quantity))
                },0)

                return {cart: filtered, totalPrice:total}
            })
        },

        clearCart: ()=>{
            set({cart:[],totalPrice:0})
        },

        totalPrice: null,
        setTotalPrice: ()=>{
            set((state)=>{
                const total = state.cart.reduce((price,item)=>{
                    return parseFloat(price) + (parseFloat(item.product.price)*parseFloat(item.quantity))
                },0)
                console.log(total)
                return ({totalPrice: total})
            })
        },

        isCartOpen: false,
        setIsCartOpen: (boo)=>{
            set({isCartOpen:boo})
        }
    }
})

export const orderStore = create((set)=>{
    return {
        orders: {},
        setOrders:(orders)=>{
            set({orders:orders})
        },

        selectedOrder: {},
        setSelectedOrder: (order)=>{

            set((state)=>{
                const singleOrder = Object.keys(state.orders).find((key) => key === order);
                return {
                    selectedOrder : {[singleOrder]: state.orders[singleOrder]}
                }
            })
        },

        pendingOrders: [],
        setPendingOrders: (pendingOrders)=>{
            set({pendingOrders:pendingOrders})
        },

        confirmedOrders: [],
        setConfirmedOrders: (confirmedOrders)=>{
            set({confirmedOrders:confirmedOrders})
        },






        cancelledOrders: [],
        setCancelledOrders: (cancelledOrders)=>{
            set({cancelledOrders:cancelledOrders})
        },


        deliveredOrders: [],
        setDeliveredOrders: (deliveredOrders)=>{
            set({deliveredOrders:deliveredOrders})
        },


        /*removes an order from pending and adds it to cancelledOrders*/

        cancelOrder:(order)=>{
            set((state)=>{
                return {pendingOrders: state.pendingOrders.filter(item=>order.id !== item.id)
                    , cancelledOrders: [...state.cancelledOrders,{...order, status:'cancelled'}]
                }
            })
        },

        updateProcessingOrder: (id)=>{
            set((state)=>{

                /* dis-structure the array and get the selected order and the remaing order*/
                const { [id]: selectedOrder, ...remainingPending } = state.pendingOrders;
                console.log(remainingPending)

                const cancelledOrder = selectedOrder.map(item => ({
                    ...item,
                    status: 'cancelled',
                    refund: 1
                }));

                return {
                    cancelledOrders : {...state.cancelledOrders, [id]: cancelledOrder},
                    orders : {...state.orders, [id]: cancelledOrder },
                    pendingOrders : remainingPending
                }
            })



        },

        updateConfirmedOrder: (id)=>{
        set((state)=>{

            /* dis-structure the array and get the selected order and the remaing order*/
            const { [id]: selectedOrder, ...remainingPending } = state.pendingOrders;
            console.log(selectedOrder)

            const confirmedOrder = selectedOrder.map(item => ({
                ...item,
                status: 'confirmed',
            }));

            return {
                confirmedOrders : {...state.confirmedOrders, [id]: confirmedOrder},
                orders: {...state.orders, [id]:confirmedOrder},
                pendingOrders : remainingPending
            }
        })

    },


        updateDeliveredOrder: (id)=>{
            set((state)=>{

                /* dis-structure the array and get the selected order and the remaing order*/
                const { [id]: selectedOrder, ...remainingPending } = state.confirmedOrders;
                console.log(selectedOrder)

                const deliveredOrder = selectedOrder.map(item => ({
                    ...item,
                    status: 'delivered',
                }));

                return {
                    deliveredOrders : {...state.deliveredOrders, [id]: deliveredOrder},
                    orders: {...state.orders, [id]:deliveredOrder},
                    confirmedOrders : remainingPending
                }
            })

        },


        updateRefund: (id)=>{
            set((state)=>{

                /* dis-structure the array and get the selected order and the remaing order*/
                const { [id]: selectedOrder, ...remainingPending } = state.cancelledOrders;
                console.log(remainingPending)

                const cancelledOrder = selectedOrder.map(item => ({
                    ...item,
                    status: 'cancelled',
                    refund: 0
                }));

                return {
                    cancelledOrders : {...state.cancelledOrders, [id]: cancelledOrder},
                    orders : {...state.orders, [id]: cancelledOrder },

                }
            })
        }

    }
})
export const complaintStore = create((set)=>{
    return {
        complaints: [],
        addComplaint: (complaint)=>{
            set((state)=>{
                return {complaints: [...state.complaints, complaint]}
            })
        },
        setComplaint: (data)=>{
          set({complaints:data})
        },
        removeComplaint: (complaint)=>{
            set((state)=>{
                return {
                    complaints: state.complaints.filter(complain=>complaint.id !== complain.id)
                }
            })
        }
    }
})


/*Admin Stores*/

export const AdminOrderStore = create((set)=>{
    return {
        adminOrders: [],
        setAdminOrders:(orders)=>{
            set({adminOrders:orders})
        },
        addAdminOrders:(order,key)=>{
            set((state)=>{
                console.log({[key]:order,...state.adminOrders})
                return {
                    adminOrders: {[key]:order,...state.adminOrders},
                    adminPendingOrders: {[key]:order,...state.adminPendingOrders},

                }
            })
        },

        adminPendingOrders: [],
        setAdminPendingOrders: (pendingOrders)=>{
            set({adminPendingOrders:pendingOrders})
        },

        adminConfirmedOrders: [],
        setAdminConfirmedOrders: (confirmedOrders)=>{
            set({adminConfirmedOrders:confirmedOrders})
        },

        adminCancelledOrders: [],
        setAdminCancelledOrders: (cancelledOrders)=>{
            set({adminCancelledOrders:cancelledOrders})
        },

        adminDeliveredOrders: [],
        setAdminDeliveredOrders: (deliveredOrders)=>{
            set({adminDeliveredOrders:deliveredOrders})
        },
        updateProcessingOrder: (id)=>{
            set((state)=>{

                /* dis-structure the array and get the selected order and the remaing order*/
                const { [id]: selectedOrder, ...remainingPending } = state.adminPendingOrders;
                console.log(selectedOrder)

                const confirmedOrder = selectedOrder.map(item => ({
                    ...item,
                    status: 'confirmed',
                }));

                return {
                    adminConfirmedOrders : {...state.adminConfirmedOrders, [id]: confirmedOrder},

                    adminPendingOrders : remainingPending
                }
            })

        },

        updateConfirmedOrder: (id)=>{
            set((state)=>{

                /* dis-structure the array and get the selected order and the remaing order*/
                const { [id]: selectedOrder, ...remainingPending } = state.adminConfirmedOrders;
                console.log(remainingPending)

                const deliveredOrder = selectedOrder.map(item => ({
                    ...item,
                    status: 'delivered',
                }));


                return {
                    adminDeliveredOrders : {...state.adminDeliveredOrders, [id]: deliveredOrder},

                    adminConfirmedOrders : remainingPending
                }
            })

        },


        updateCancelOrder: (id)=>{
            set((state)=>{

                /* dis-structure the array and get the selected order and the remaing order*/
                const { [id]: selectedOrder, ...remainingPending } = state.adminPendingOrders;
                console.log(remainingPending)

                const cancelledOrder = selectedOrder.map(item => ({
                    ...item,
                    status: 'cancelled',
                }));


                return {
                    adminCancelledOrders : {...state.adminCancelledOrders, [id]: cancelledOrder},
                    adminOrders : {...state.adminOrders, [id]: cancelledOrder},
                    adminPendingOrders : remainingPending,
                    awaitingRefund: {...state.awaitingRefund, [id]: cancelledOrder }
                }
            })

        },


        awaitingRefund: [],
        setAwaitingRefund: (cancelledOrders)=>{
            set({awaitingRefund:cancelledOrders})
        },

        updateRefundOrder: (id)=>{
            set((state)=>{

                /* dis-structure the array and get the selected order and the remaing order*/
                const { [id]: selectedOrder, ...remainingPending } = state.awaitingRefund;
                console.log(remainingPending)

                return {

                    awaitingRefund : remainingPending
                }
            })

        },


        totalRevenue: 0,
        setTotalRevenue : (revenue)=>{
          set({totalRevenue: revenue})
        },


        /*removes an order from pending and adds it to cancelledOrders*/

        cancelOrder:(order)=>{
            set((state)=>{
                return {adminPendingOrders: state.adminPendingOrders.filter(item=>order.id !== item.id)
                    , adminCancelledOrders: [...state.adminCancelledOrders,{...order, status:'cancelled'}]
                }
            })
        },

    }
})

export const AdminUserStore = create((set)=>{
    return {
        users: [],
        setUsers: ((users)=>{
            return  set({users:users})
        }),
        deleteUser: (user)=>{
            set((state)=>{
                return{
                    users: state.users.filter(singleUser=>singleUser.id !== user.id)
                }
            })
        }
    }
})

export const adminComplaintStore = create((set)=>{
    return {
        userComplaints: [],
        addUserComplaint: (complaint)=>{
            set((state)=>{
                return {userComplaints: [...state.userComplaints, complaint]}
            })
        },
        userPendingComplaints: [],
        addUserPendingComplaint: (complaint)=>{
            set((state)=>{
                return {userPendingComplaints: [...state.userPendingComplaints, complaint]}
            })
        },

        setUserComplaint: (complaint)=>{
            set((state)=>{
                return {userComplaints: complaint}
            })
        },

        setUserPendingComplaint: (complaint)=>{
            set((state)=>{
                return {userPendingComplaints: complaint}
            })
        },


        removeUserPendingComplaint: (complaint)=>{
            set((state)=>{
                return {
                    userPendingComplaints: state.userPendingComplaints.filter(complain=>complaint.id !== complain.id)
                }
            })
        },

        removeUserComplaint: (complaint)=>{
            set((state)=>{
                return {
                    userComplaints: state.userComplaints.filter(complain=>complaint.id !== complain.id)
                }
            })
        },
        setComplaintResponse: (response,complaint_id)=>{
            set((state)=>{
                const updatedComplaint = state.userComplaints?.map(complaint =>
                    complaint.id === complaint_id
                        ? { ...complaint,status:'resolved', response: complaint.response.map((res)=>{
                                return complaint.response[0].id === res.id ? {...res, description:response}:res
                            }) }
                        : complaint
                )
                const pendingComplaint = state.userComplaints.filter(complain=>complaint_id !== complain.id)

                console.log(updatedComplaint)
                return {
                    userComplaints : updatedComplaint,
                    userPendingComplaints : pendingComplaint
                }

            })

        },

        updateResponse: (response,complaint_id,response_id)=>{
            set((state)=>{
                const updatedComplaint = state.userComplaints?.map(complaint =>
                    complaint.id === complaint_id
                        ? { ...complaint, response: complaint.response.map((res)=>{
                               return response_id === res.id ? {...res, description:response}:res
                            }) }
                        : complaint
                )

                return {
                    userComplaints : updatedComplaint,
                }

            })
        }

    }
})


export const adminRefund = create((set)=>{
    return {
        refund: [],
        setRefund: (complaint)=>{
            set((state)=>{
                return {refund: [...state.refund, complaint]}
            })
        },
        removeRefund: (complaint)=>{
            set((state)=>{
                return {
                    refund: state.refund.filter(complain=>complaint.id !== complain.id)
                }
            })
        }
    }
})



