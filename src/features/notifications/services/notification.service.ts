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
        console.log('fcmToken: ' + reciver.fcmToken);
        // skip sending notification if user don't have FCM token
        if (reciver.fcmToken === '') return;

        const title = this.generateNotificationTitle(type);
        const payload = {
            token: reciver.fcmToken,
            notification: {
                title,
                body,
            },
            data: {
                sender: JSON.stringify(userService.getUserProfile(sender)),
                type: type.toString(),
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
        const title = this.generateNotificationTitle(type);
        const messages = receivers
            .map((receiver) => {
                activityService.logActivity(receiver.id, sender.id, type, body);

                if (receiver.fcmToken === '') return null;

                return {
                    token: receiver.fcmToken,
                    notification: {
                        title,
                        body,
                    },
                    data: {
                        sender: JSON.stringify(
                            userService.getUserProfile(sender)
                        ),
                        type: type.toString(),
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

    /**
     * Generates a notification title based on the activity type.
     * @param type - The type of activity.
     * @returns The generated notification title.
     */
    private generateNotificationTitle(type: activityType): string {
        switch (type) {
            case activityType.like:
                return 'You have a new like!';
            case activityType.comment:
                return 'Someone commented on your post!';
            case activityType.follow:
                return 'You have a new follower!';
            case activityType.post:
                return 'Someone you follow uploaded a new post!';
            default:
                return 'You have a new notification!';
        }
    }
}

export default new NotificationService();
