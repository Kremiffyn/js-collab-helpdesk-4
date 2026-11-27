export function initSnowman(){
    const img = document.getElementById("Snowman")!;

    function lightSnowman() 
    {
        if ((<HTMLImageElement>img)!.src.includes("images/Snowman.png")) 
            {
                const snowmanSound=new Audio('./sounds/lighting.mp3');
                snowmanSound.play();
            (<HTMLImageElement>img)!.src = "images/Snowman_light.png";

        } else {
            const snowmanSound=new Audio('./sounds/no_lighting.mp3');
                snowmanSound.play();
            (<HTMLImageElement>img)!.src = "images/Snowman.png";
        }
    }

    img!.addEventListener("click", function(event) {
        lightSnowman();
    });
}