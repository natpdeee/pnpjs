import { jsS, TypedHash, extend } from "@pnp/common";
import { GraphQueryableInstance, defaultPath } from "./graphqueryable";
import { Invitation as IInvitation } from "@microsoft/microsoft-graph-types";

@defaultPath("invitations")
export class Invitations extends GraphQueryableInstance<IInvitation[]> {

    /**
     * Create a new Invitation via invitation manager.
     * 
     * @param invitedUserEmailAddress The email address of the user being invited.
     * @param inviteRedirectUrl The URL user should be redirected to once the invitation is redeemed.
     * @param additionalProperties A plain object collection of additional properties you want to set in the invitation
     */
    public create(invitedUserEmailAddress: string, inviteRedirectUrl: string, additionalProperties: TypedHash<any> = {}): Promise<InvitationAddResult> {

        const postBody = extend({
            inviteRedirectUrl: inviteRedirectUrl,
            invitedUserEmailAddress: invitedUserEmailAddress,
        }, additionalProperties);

        return this.postCore({
            body: jsS(postBody),
        }).then(r => {
            return {
                data: r,
            };
        });
    }

}

export interface InvitationAddResult {
    data: IInvitation;
}
