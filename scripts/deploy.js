async function main(){
    const Token = await ethers.getContractFactory("Token");

    const token = await HelloWorld.deploy("Token");
    console.log("Contract deployed to address: ", token.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });