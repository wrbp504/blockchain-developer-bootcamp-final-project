## SWC-103 (Floating pragma)
In this case we are using o.8.9 specifically

## Use Modifiers Only for Validation
All modifiers only for validation

## Pull Over Push (Prioritize receiving contract calls over making contract calls)
Fees collected are not sent to owner automatically but collected by the owner through a function

## SWC-105 (Unprotected Ether Withdrawal)
function `collectFees()` is protected with OpenZeppelin `Ownable`'s `onlyOwner` modifier