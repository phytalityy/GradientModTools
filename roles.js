export const Roles = {

EntryModerator:
"1516768057677058220",

Moderator:
"1506385513181872149",

LeadModerator:
"1506384120949899316",

HeadModerator:
"1506419619089350759",

Administrator:
"1516752884539195515",

StaffManager:
"1515499498279800936"

};


export function getRoleName(ids){


if(ids.includes(Roles.StaffManager))
return "Staff Manager";


if(ids.includes(Roles.Administrator))
return "Administrator";


if(ids.includes(Roles.HeadModerator))
return "Head Moderator";


if(ids.includes(Roles.LeadModerator))
return "Lead Moderator";


if(ids.includes(Roles.Moderator))
return "Moderator";


if(ids.includes(Roles.EntryModerator))
return "Entry Moderator";


return "No Staff Role";

}
