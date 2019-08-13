import { expect } from "chai";
import { testSettings } from "../main";
import { sp } from "@pnp/sp";
import "@pnp/sp/src/webs";
import "@pnp/sp/src/site-groups";
import { getRandomString } from "@pnp/common";
import { IGroupAddResult } from '@pnp/sp/src/site-groups';


describe("Web.SiteGroups", () => {
    if (testSettings.enableWebTests) {
        let newGroup: IGroupAddResult;

        before(async function() {
            this.timeout(0);
            const groupName = `test_new_sitegroup_${getRandomString(6)}`;
            newGroup = await sp.web.siteGroups.add({ "Title" : groupName });
        });

        it("siteGroups()", function() {
            return expect(sp.web.siteGroups()).to.eventually.be.fulfilled;
        });

        it("associatedOwnerGroup()", function() {
            return expect(sp.web.associatedOwnerGroup()).to.eventually.be.fulfilled;
        });

        it("associatedMemberGroup()", function() {
            return expect(sp.web.associatedMemberGroup()).to.eventually.be.fulfilled;
        });

        it("associatedVisitorGroup()", function() {
            return expect(sp.web.associatedVisitorGroup()).to.eventually.be.fulfilled;
        });

        it(".createDefaultAssociatedGroups()", function() {
            return expect(sp.web.createDefaultAssociatedGroups("PNPTest",
            testSettings.sp.sitedesigns.testuser,
            false,
            false,
            testSettings.sp.sitedesigns.testuser)).to.be.eventually.fulfilled;
        });

        it(".getById()", async function() {
            return expect(sp.web.siteGroups.getById(newGroup.data.Id)());
        });

        it(".add()", function() {
            const newGroupTitle = `test_add_new_sitegroup_${getRandomString(8)}`;
            return expect(sp.web.siteGroups.add({ "Title" : newGroupTitle})).to.be.eventually.fulfilled;
        });

        it(".getByName()", function() {
            return expect(sp.web.siteGroups.getByName(newGroup.data.Title)()).to.be.eventually.fulfilled;
        });

        it(".removeById()", async function() {
            const newGroupTitle = `test_remove_group_by_id_${getRandomString(8)}`;
            const g = await sp.web.siteGroups.add({ "Title":newGroupTitle });
            return expect(sp.web.siteGroups.removeById(g.data.Id)).to.be.eventually.fulfilled;
        });

        it(".removeByLoginName()", async function() {
            const newGroupTitle = `test_remove_group_by_name_${getRandomString(8)}`;
            const g = await sp.web.siteGroups.add({ "Title":newGroupTitle });
            return expect(sp.web.siteGroups.removeByLoginName(g.data.LoginName)).to.be.eventually.fulfilled;
        });

        it("SiteGroup.users()", async function() {
            return expect(sp.web.siteGroups.getById(newGroup.data.Id).users()).to.be.eventually.fulfilled;
        });

        it("SiteGroup.update()", async function() {
            const newTitle = `Updated_${newGroup.data.Title}`;
            await sp.web.siteGroups.getByName(newGroup.data.Title).update({ "Title": newTitle });
            const p = sp.web.siteGroups.getById(newGroup.data.Id).select("Title").get<{ "Title":string }>().then(g2 => {
                if (newTitle !== g2.Title) {
                    throw Error("Failed to update the group!");
                }
            });
            return expect(p).to.be.eventually.fulfilled;
        });

    }
});
