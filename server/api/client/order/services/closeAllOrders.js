import editOrder from '../queries/editOrder';
import editUser from '../../user/queries/editUser';
import getOpenedOrdersByUserId from '../queries/getOpenedOrdersByUserId';

import pricesController from '../../../../controllers/pricesController';

export default function closeAllOrders (userId) {
    try {
        getOpenedOrdersByUserId(userId)
            .then(orders => {
                Promise.all(
                    orders.map(order => {
                        const closedOrder = {
                            id: order.id,
                            isClosed: true,
                            closedAt: Date.now(),
                            closedPrice: pricesController.prices[order.assetName]
                        };

                        return editOrder(closedOrder);
                    })
                )
                    .then(() => {
                        const updatedUser = {
                            id: userId,
                            balance: 0,
                            bonuses: 0,
                            credFacilities: 0,
                            mainBalance: 0
                        };
                        editUser(updatedUser)
                            .then(() => {});
                    });
            });
    } catch (e) {}
}
