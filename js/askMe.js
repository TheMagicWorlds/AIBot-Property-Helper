document.addEventListener("DOMContentLoaded", () => {
    const questionInput = document.getElementById("question");
    const askButton = document.getElementById("ask");
    const responseDiv = document.getElementById("response");

    const handleAsk = async () => {
        const question = questionInput.value;
        questionInput.innerHTML = " "
        if (question) {
            askButton.innerHTML = '<img id="loading-img" src="assets/images/loading2.svg" width="110" height="20" alt="Loading" />';
            setResponse('Please wait! Response is coming....')
            setIsLoading(true)
            try {
                const url = 'https://api.openai.com/v1/chat/completions';
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer OPENAI_KEY`,
                      },
                    body: JSON.stringify({
                        messages: [
                            {
                                role: 'user',
                                content: question
                            }
                        ],
                        model: 'gpt-3.5-turbo-16k',
                    })
                };
                axios
                    .request({
                        url,
                        method: options.method,
                        headers: options.headers,
                        data: options.body
                    })
                    .then((response) => {
                        const regex = /\\n/g;
                        const ans = response.choices[0].message.content.replace(regex, '<br>');
                        // console.log(response.data.choices[0].message.content)
                        setResponse(ans);
                        setIsLoading(false)
                        console.log(response);
                    })
                    .catch((error) => {
                        console.error(error);
                        setIsLoading(false)
                        setResponse('Something went wrong. Please try again')
                    });
            } catch (error) {
                console.error(error);
                setIsLoading(false)
                setResponse('Something went wrong. Please try again')
            }
        }
    };

    const setResponse = (text) => {
        responseDiv.innerHTML = text;
    };

    const setIsLoading = (isLoading) => {
        askButton.disabled = isLoading;
        if (isLoading) {
            askButton.style.cursor = 'not-allowed'
        }
        else {
            askButton.innerHTML = 'Ask';
            askButton.style.cursor = 'pointer';
        }
    };

    askButton.onclick = handleAsk
});