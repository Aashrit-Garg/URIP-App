Moralis.Cloud.afterSave("URIPTokens", async function (request) {
    const confirmed = request.object.get("confirmed");
    if (!confirmed) {
        const tokenId = request.object.get("tokenId");
        const owner = request.object.get("owner");
        const transactionHash = request.object.get("transaction_hash");
        const query = new Moralis.Query("Mints");
        query.equalTo("transaction", transactionHash);
        await query.find().then(async function ([application]) {
            application.set("tokenId", tokenId);
            application.set("owner", owner)
            await application.save();
        });

        await Moralis.Cloud.httpRequest({
            method: "POST",
            url: "https://onesignal.com/api/v1/notifications",
            body: {
                app_id: "a7120e2b-2b51-480f-a500-6e832ed307d8",
                contents: { "en": "Notification" },
                included_segments: ["Subscribed Emails"],
                name: "Email",
                email_body: `Certificate ID: ${tokenId}`,
                email_subject: "URIP"
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic YzI4NGZmODgtNDZhYy00YWU5LTlkYjItYzhjYTQ1NGI0YmUx'
            },
        });
    }
});