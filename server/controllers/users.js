import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    //below line means get all the friends of curret user from the db by finding each id user has(uske friend ki wajah se).
    //Promise.all() - takes an array of promises(an iterable) as an input and returns a single Promise that is resolved when all the iterable promises gets resolved. Agar ek bhi reject hoga to resultant promise bhi reject hoga.
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    //below line means that we want to format friend's data in a good format for frontend.
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    //this means that if friendId is included in main user's friendId then, remove it and form a new friends array by .filter().
    if (user.friends.includes(friendId)) {
      //us friend ko remove kar diya main user ki list se.
      user.friends = user.friends.filter((id) => id !== friendId);
      //jis friend ko remove kiya uski khudki list se main user ko bhi hatana .
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      //else ka matlb agar wo friend nhi h to add karo usko friend's list me.
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    //ye updated method tha to hume user aur uske friend ke DB changes ko save karna padega.
    await user.save();
    await friend.save();
    
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    //upper ki tarah formatting karna.
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
