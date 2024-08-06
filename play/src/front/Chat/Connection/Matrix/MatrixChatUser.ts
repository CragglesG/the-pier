import { MatrixClient, SetPresence, User } from "matrix-js-sdk";
import { writable } from "svelte/store";
import { AvailabilityStatus } from "@workadventure/messages";
import { ChatUser } from "../ChatConnection";

export const chatUserFactory: (matrixChatUser: User, matrixClient: MatrixClient) => ChatUser = (
    matrixChatUser,
    matrixClient
) => {
    const chatUser: ChatUser = {
        chatId: "",
        username: "",
        roomName: undefined,
        playUri: undefined,
        avatarUrl: undefined,
        color: undefined,
        id: undefined,
        availabilityStatus: writable(AvailabilityStatus.ONLINE),
    };
    chatUser.chatId = matrixChatUser.userId;
    chatUser.username = matrixChatUser.displayName;
    chatUser.avatarUrl = matrixClient.mxcUrlToHttp(matrixChatUser.avatarUrl ?? "", 48, 48) ?? undefined;

    chatUser.avatarUrl = matrixChatUser.avatarUrl ?? undefined;
    chatUser.availabilityStatus.set(mapMatrixPresenceToAvailabilityStatus(matrixChatUser.presence));
    return chatUser;
};

function mapMatrixPresenceToAvailabilityStatus(presence: string = SetPresence.Offline): AvailabilityStatus {
    switch (presence) {
        case SetPresence.Offline:
            return AvailabilityStatus.UNCHANGED;
        case SetPresence.Online:
            return AvailabilityStatus.ONLINE;
        case SetPresence.Unavailable:
            return AvailabilityStatus.AWAY;
        default:
            //TODO : Create Error
            throw new Error(`Do not handle the status ${presence}`);
    }
}
