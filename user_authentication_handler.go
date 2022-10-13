package main

type User struct{
    FirstName string `json:"firstname"` 
    LastName string `json:"lastname"` 
    Email string `json:"email"` 
    Password string `json:"password"`
}

func userSignup(response http.ResponseWriter, request *http.Request{                       
    response.Header().Set("Content-Type","application/json")             
    var user User json.NewDecoder(request.BoZdy).Decode(&user)
    user.Password = getHash([]byte(user.Password)) 
    collection := client.Database("GODB").Collection("user") 
    ctx,_ := context.WithTimeout(context.Background(),      
             10*time.Second) 
    result,err := collection.InsertOne(ctx,user)
    if err!=nil{     
        response.WriteHeader(http.StatusInternalServerError)    
        response.Write([]byte(`{"message":"`+err.Error()+`"}`))    
        return
    }    
    json.NewEncoder(response).Encode(result)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != "POST" {
        http.Error(w, "Method Not Supported", http.StatusMethodNotAllowed)
        return
    }

  // Get username and password from the parsed form
    username := r.Form.Get("username")
    password := r.Form.Get("password")

    // Check if user exists
    storedPassword, exists := users[username]
    if exists {
        // It returns a new session if the sessions doesn't exist
        session, _ := store.Get(r, "session.id")
        if storedPassword == password {
            session.Values["authenticated"] = true
            // Saves all sessions used during the current request
            session.Save(r, w)
        } else {
            http.Error(w, "Invalid Credentials", http.StatusUnauthorized)
        }
        w.Write([]byte("Login successfully!"))
    }

}