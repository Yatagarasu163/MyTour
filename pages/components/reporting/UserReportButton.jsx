"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import React from "react";
import { useSession } from "next-auth/react";

export default function UserReportButton(props){

    const [reason, setReason] = useState("r1");
    const [showOther, setShowOther] = useState(false);
    const [reasonDesc, setReasonDesc] = useState("");
    const { data: session, status } = useSession();
    const [submitted, setSubmitted] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    async function onFormSubmit(event){

        event.preventDefault();

        const payload = {
            reportingUser: session.user.id,
            reportedUser: props.userId,
            reportReason: reason,
            reportDesc: reasonDesc,
        }

        setSubmitted(true);

        const res = await fetch("/api/admin/users/report", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        if(res.status === 409){
            setSubmitMessage("This user has already been reported by you!");
        } else if(res.status === 500){
            setSubmitMessage("An unexpected error occured. Please try again later.");
        } else if(res.status === 200){
            setSubmitMessage("Report submitted successfully!")
        }
    }

    function onReasonChange(event) {
        const value = event.target.value;
        if(value === "r5"){
            setShowOther(true);
        } else{
            setShowOther(false);
        }

        setReason(value);
    }

    function onReasonDescChange(event){
        const value = event.target.value;
        setReasonDesc(value);
    }

    useEffect(() => {
    if (submitted) {
        setTimeout(() => setSubmitted(false), 3000); // Reset after 3 seconds
    }
    }, [submitted]);

    return <div> 
        <Dialog>
          <DialogTrigger asChild>
            <Button>Report</Button>
          </DialogTrigger>
          <DialogContent onClose={() => setSubmitted(false)}>
        <form onSubmit={onFormSubmit}>
            <DialogHeader>
              <DialogTitle>Report a User</DialogTitle>
            </DialogHeader>
            <Label>Select a Reason</Label>
            <select name="reason" value={reason} onChange={onReasonChange}>
                <option value="r1">
                    Harrasment or Abuse
                </option>
                <option value="r2">
                    Fake identity or Impersonation
                </option>
                <option value="r3">
                    Inappropriate Profile Content
                </option>
                <option value="r4">
                    Spamming or scamming
                </option>
                <option value="r5">
                    Other
                </option>
            </select>
            <input
            type="text"
            name="reasonDesc"
            id="reasonDesc"
            onChange={onReasonDescChange}
            value={reasonDesc}
            style={{ display: showOther ? "block" : "none" }}
            />
            <hr />
            <input type="hidden" name="id" value={props.userId}/>
            {submitted ? (<p>{submitMessage}</p>) : (<button type="submit">Submit Report</button>)}
        </form>
          </DialogContent>
      </Dialog>
    </div>
} 