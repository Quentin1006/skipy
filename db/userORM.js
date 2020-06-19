const UserModel = require("../models/User");

module.exports = (db) => {

	const Users = db.collection('Users');

    // Get all the users matching all the selected filters
	const getUsers = (filters={}) => {
		return Users.find(filters)
			.then(users => {
				return users.map(usr => new UserModel(usr))
			})
			.catch(err => {
				return err
			})
	}


	/** returns all the user whose name, lastname or both matches partially the text  */ 
	const getUsersByName = async (text, opts) => {
		opts = {
			max:10,
			minLength:2,
			...opts
		}

		if(text.length < opts.minLength){
			return [];
		}

		const search = new RegExp(text, 'i')

		const matchedUsers = await Users.find({ 
			$or: [{ firstname: search, lastname: search }] 
		}, {
			limit: opts.max
		}).toArray();

		return matchedUsers.map(usr => new UserModel(usr));
	}


	const getUserById = (id) => {
		return getUsers({id})[0];
	}


	const getUserByMail = (email) => {
		return getUsers({email})[0];
	}


	const addUser = async (user) => {
		if(getUserByMail(user.email)){
			return {err: 'Already a user matching that mail'};
		}
		
		const newUser = UserModel.validateUser(user);
		const insertOpe = await Users.insertOne(newUser);

		return insertOpe.result.ok === 1
			? new UserModel(newUser)
			: {err: 'Error adding the user'}
	}


	const updateUser = async (userId, fields) => {
		const userToUpdate = await Users.findOne({id: userId}).toArray();

		const updatedUser = UserModel.validateUser({
			...userToUpdate,
			...fields
		});

		if(updatedUser.err) {
			return {err}
		}

		const updateOpe = await Users.findOneAndUpdate({id: userId}, updatedUser)

		return updateOpe.result.ok === 1
			? new UserModel(updatedUser)
			: { err: 'Error while updating user'}
	}


	const checkIfUserExists = (value, crit="id") => {
		return getUsers({[crit]: value})[0];
	}


	return {
		getUserById,
		getUserByMail,
		getUsers,
		getUsersByName,
		addUser,
		updateUser,
		checkIfUserExists
	}

}