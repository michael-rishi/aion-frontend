
import avm.Blockchain;
import org.aion.avm.tooling.abi.Callable;
import org.aion.avm.userlib.abi.ABIDecoder;

import java.math.BigInteger;

public class HelloAvm
{
    private static String myStr = "Hello AVM";

    @Callable
    public static void setString(String newStr) {
        myStr = newStr;
        Blockchain.println("New string is " + myStr);
    }
    @Callable
    public static String getString() {
        Blockchain.println("Current string is " + myStr);
        return myStr;
    }


}
