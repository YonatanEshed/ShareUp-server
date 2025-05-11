import admin from '../../../config/firebase';
import User from '../../../features/users/models/user.model';
import userService from '../../../features/users/services/user.service';
import activityService from './activity.service';
import { activityType } from '../models/activity.model';

class NotificationService {
    /**
     * Sends a notification to a specific device using FCM.
     * @param fcmToken - The FCM token of the target device.
     * @param title - The title of the notification.
     * @param body - The body of the notification.
     * @param data - Additional data to send with the notification.
     */
    async sendNotification(
        sender: User,
        reciver: User,
        type: activityType,
        body: string
    ): Promise<void> {
        activityService.logActivity(reciver.id, sender.id, type, body);

        // skip sending notification if user don't have FCM token
        if (reciver.fcmToken === '') return;

        const payload = {
            token: reciver.fcmToken,
            notification: {
                sender: userService.getUserProfile(sender),
                type,
                body,
            },
        };

        try {
            await admin.messaging().send(payload);
            console.log('Notification sent successfully');
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    }

    /**
     * Sends a notification to multiple devices using FCM.
     * @param fcmTokens - An array of FCM tokens of the target devices.
     * @param title - The title of the notification.
     * @param body - The body of the notification.
     * @param data - Additional data to send with the notification.
     */
    async sendNotificationToMultiple(
        sender: User,
        receivers: User[],
        type: activityType,
        body: string
    ): Promise<void> {
        const messages = receivers
            .map((receiver) => {
                activityService.logActivity(receiver.id, sender.id, type, body);

                if (receiver.fcmToken === '') return null;

                return {
                    token: receiver.fcmToken,
                    notification: {
                        sender: userService.getUserProfile(sender),
                        type,
                        body,
                    },
                };
            })
            .filter((message) => message !== null); // Filter out null values for users without FCM tokens

        try {
            const responses = await Promise.all(
                messages.map((message) => admin.messaging().send(message!))
            );
            console.log(`${responses.length} notifications sent successfully`);
        } catch (error) {
            console.error('Error sending notifications:', error);
        }
    }
}

export default new NotificationService();
