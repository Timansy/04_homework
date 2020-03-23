# 03 JavaScript: Password Generator

This week, we took some existing structure and added a password creation function that followed some basic rules.

## Review

In order to meet the requirements, I did the following.

1. Get the length the customer wants their password to be: To do this, I provided a prompt that grabs some input and then used the isNaN function to validate.

2. Allow the user to select the character types to include: Here I iterated through the types available and then tested for at least one selection.

3. Supply a pw that has at least one of each element: Here i looped through and randomly selected 1 character from each character set and added it to the the existing string until the length requirement was met. I then returned a substring that contained the just the needed size (in case the looping provided more than needed).