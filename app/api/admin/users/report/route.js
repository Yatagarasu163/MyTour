import { db } from "../../../lib/actions/pool";

export async function POST(request, context){
    const body = await request?.json();
    const reportTypes = {
        "r1": "Harassment or Abuse",
        "r2": "Fake Identity or Impersonation",
        "r3": "Inappropriate Profile Content",
        "r4": "Spamming or Scamming"
    }
    try{

        let reason = ""

        if(body?.reportDesc){
            reason = body?.reportDesc;
        }
        else{
            reason = reportTypes[body?.reportReason]
        }

        const check = await db.query(`SELECT * FROM REPORT WHERE REPORTED_USER_ID = $1 AND USER_ID = $2 AND REPORT_STATUS = $3`, [body?.reportedUser, body?.reportingUser, "Pending"]);
        if(check.rowCount > 0){
            return new Response({}, {status: 409});
        } else{
            const result = await db.query(`INSERT INTO REPORT (REPORT_OPTION, REPORT_STATUS, REPORTED_USER_ID, USER_ID) VALUES ($1, $2, $3, $4) RETURNING *`, [reason, "Pending", body?.reportedUser, body?.reportingUser]);
            if(result.rowCount > 0){
                return new Response({}, {status: 200});
            } else{
                return new Response({}, {status: 409});
            }
        }

    } catch (err) {
        console.log(err);
        return new Response({}, {status: 500})
    }
}