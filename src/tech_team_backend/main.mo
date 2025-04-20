import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Hash "mo:base/Hash";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";
import Nat32 "mo:base/Nat32";
import Char "mo:base/Char";
import Int "mo:base/Int";

actor ThaparGo {
  // Society type
  type Society = {
    id : Text;
    name : Text;
    description : Text;
    category : Text;
    logoUrl : Text;
    registrationStatus : Text;
    registrationLink : Text;
    facultyHead : Text;
    room : Text;
    email : Text;
    phoneNumber : Text;
    members : Nat;
    establishedYear : Nat;
  };

  // Social media links
  type SocialMedia = {
    instagram : ?Text;
    linkedin : ?Text;
    facebook : ?Text;
  };

  // Society with social media
  type SocietyWithSocial = {
    society : Society;
    socialMedia : SocialMedia;
  };

  // User types
  type User = {
    email: Text;
    passwordHash: Text;
    createdAt: Int;
    lastLogin: ?Int;
  };

  type UserProfile = {
    email: Text;
    createdAt: Int;
  };

  type AuthError = {
    #InvalidCredentials;
    #UserNotFound;
    #UserAlreadyExists;
    #InvalidEmail;
    #NotAuthenticated;
  };

  // Session type
  type Session = {
    userId: Text;
    token: Text;
    expiresAt: Int;
  };

  // Initialize societies storage
  private var nextId : Nat = 1;
  private let societies = HashMap.HashMap<Text, SocietyWithSocial>(0, Text.equal, Text.hash);

  // Initialize users storage
  private let users = HashMap.HashMap<Text, User>(0, Text.equal, Text.hash);
  private let sessions = HashMap.HashMap<Text, Session>(0, Text.equal, Text.hash);

  // Add initial data
  private func addInitialData() {
    let initialSocieties = [
      {
        society = {
          id = "1";
          name = "ACM Student Chapter";
          description = "The Association for Computing Machinery (ACM) is the world's largest educational and scientific computing society. The Thapar ACM Student Chapter aims to promote interest in computing and provide opportunities for students to develop their technical skills.";
          category = "Technical";
          logoUrl = "https://via.placeholder.com/100?text=ACM";
          registrationStatus = "open";
          registrationLink = "https://forms.gle/example1";
          facultyHead = "Dr. Rajesh Kumar";
          room = "E-Block, Room 201";
          email = "acm@thapar.edu";
          phoneNumber = "+91 9876543210";
          members = 120;
          establishedYear = 2015;
        };
        socialMedia = {
          instagram = ?"https://instagram.com/acmthapar";
          linkedin = ?"https://linkedin.com/company/acmthapar";
          facebook = ?"https://facebook.com/acmthapar";
        };
      },
      {
        society = {
          id = "2";
          name = "MLSC - Microsoft Learn Student Chapter";
          description = "Microsoft Learn Student Chapter at Thapar is a technical community that aims to enable students to learn about Microsoft technologies and build innovative solutions.";
          category = "Technical";
          logoUrl = "https://via.placeholder.com/100?text=MLSC";
          registrationStatus = "closed";
          registrationLink = "https://forms.gle/example2";
          facultyHead = "Dr. Maninder Singh";
          room = "F-Block, Room 105";
          email = "mlsc@thapar.edu";
          phoneNumber = "+91 9876543211";
          members = 150;
          establishedYear = 2018;
        };
        socialMedia = {
          instagram = ?"https://instagram.com/mlscthapar";
          linkedin = ?"https://linkedin.com/company/mlscthapar";
          facebook = ?"https://facebook.com/mlscthapar";
        };
      },
      {
        society = {
          id = "3";
          name = "Thapar MUN Society";
          description = "Thapar MUN Society organizes Model United Nations conferences and debates to promote diplomacy, public speaking, and global awareness among students.";
          category = "Literary";
          logoUrl = "https://via.placeholder.com/100?text=MUN";
          registrationStatus = "open";
          registrationLink = "https://forms.gle/example3";
          facultyHead = "Dr. Sonia Grover";
          room = "H-Block, Room 302";
          email = "mun@thapar.edu";
          phoneNumber = "+91 9876543212";
          members = 80;
          establishedYear = 2012;
        };
        socialMedia = {
          instagram = ?"https://instagram.com/thaparmun";
          linkedin = ?"https://linkedin.com/company/thaparmun";
          facebook = ?"https://facebook.com/thaparmun";
        };
      },
      {
        society = {
          id = "4";
          name = "Thapar Music Society";
          description = "Thapar Music Society is a platform for music enthusiasts to showcase their talents, learn from each other, and organize musical events on campus.";
          category = "Cultural";
          logoUrl = "https://via.placeholder.com/100?text=Music";
          registrationStatus = "coming-soon";
          registrationLink = "https://forms.gle/example4";
          facultyHead = "Dr. Amit Sharma";
          room = "C-Block, Room 110";
          email = "music@thapar.edu";
          phoneNumber = "+91 9876543213";
          members = 100;
          establishedYear = 2010;
        };
        socialMedia = {
          instagram = ?"https://instagram.com/thaparmusic";
          linkedin = ?"https://linkedin.com/company/thaparmusic";
          facebook = ?"https://facebook.com/thaparmusic";
        };
      },
      {
        society = {
          id = "5";
          name = "Thapar Sports Society";
          description = "Thapar Sports Society promotes sports culture on campus by organizing tournaments, training sessions, and representing the university in inter-college competitions.";
          category = "Sports";
          logoUrl = "https://via.placeholder.com/100?text=Sports";
          registrationStatus = "open";
          registrationLink = "https://forms.gle/example5";
          facultyHead = "Dr. Rajiv Mehta";
          room = "Sports Complex, Room 5";
          email = "sports@thapar.edu";
          phoneNumber = "+91 9876543214";
          members = 200;
          establishedYear = 2005;
        };
        socialMedia = {
          instagram = ?"https://instagram.com/thaparsports";
          linkedin = ?"https://linkedin.com/company/thaparsports";
          facebook = ?"https://facebook.com/thaparsports";
        };
      }
    ];

    for (society in initialSocieties.vals()) {
      societies.put(society.society.id, society);
    };
  };

  // Call the function to add initial data
  addInitialData();

  // Public query function to get all societies
  public query func getAllSocieties() : async [SocietyWithSocial] {
    Iter.toArray(societies.vals())
  };

  // Public query function to get society by ID
  public query func getSocietyById(id : Text) : async ?SocietyWithSocial {
    societies.get(id)
  };

  // Public function to add a new society
  public func addSociety(
    name : Text,
    description : Text,
    category : Text,
    logoUrl : Text,
    registrationStatus : Text,
    registrationLink : Text,
    facultyHead : Text,
    room : Text,
    email : Text,
    phoneNumber : Text,
    members : Nat,
    establishedYear : Nat,
    instagram : ?Text,
    linkedin : ?Text,
    facebook : ?Text
  ) : async Text {
    let id = Nat.toText(nextId);
    nextId += 1;

    let newSociety : Society = {
      id = id;
      name = name;
      description = description;
      category = category;
      logoUrl = logoUrl;
      registrationStatus = registrationStatus;
      registrationLink = registrationLink;
      facultyHead = facultyHead;
      room = room;
      email = email;
      phoneNumber = phoneNumber;
      members = members;
      establishedYear = establishedYear;
    };

    let socialMedia : SocialMedia = {
      instagram = instagram;
      linkedin = linkedin;
      facebook = facebook;
    };

    let societyWithSocial : SocietyWithSocial = {
      society = newSociety;
      socialMedia = socialMedia;
    };

    societies.put(id, societyWithSocial);
    id
  };

  // Simple hash function for passwords
  // Note: In a production environment, use a proper cryptographic hash function
  private func hashPassword(password: Text): Text {
    var hash: Nat32 = 0;
    for (char in password.chars()) {
      let charCode = Nat32.fromNat(Nat32.toNat(Char.toNat32(char)));
      hash := (hash *% 31 +% charCode) *% 7919; // Simple hash algorithm
    };
    Nat32.toText(hash)
  };

  // Generate a random session token
  private func generateToken(email: Text): Text {
    let now = Time.now();
    let combined = email # Nat.toText(Int.abs(now));
    hashPassword(combined) # Nat.toText(Int.abs(now) % 10000)
  };

  // Validate Thapar email
  private func validateThaparEmail(email: Text): Bool {
    let lowercaseEmail = Text.toLowercase(email);
    Text.endsWith(lowercaseEmail, #text "@thapar.edu")
  };

  // Register a new user
  public func register(email: Text, password: Text): async Result.Result<UserProfile, Text> {
    // Validate email format
    if (not validateThaparEmail(email)) {
      return #err("Only @thapar.edu email addresses are allowed");
    };

    // Check if user already exists
    switch (users.get(email)) {
      case (?_) {
        return #err("User with this email already exists");
      };
      case null {
        let passwordHash = hashPassword(password);
        let now = Time.now();
        
        let newUser: User = {
          email = email;
          passwordHash = passwordHash;
          createdAt = now;
          lastLogin = null;
        };
        
        users.put(email, newUser);
        
        let profile: UserProfile = {
          email = email;
          createdAt = now;
        };
        
        return #ok(profile);
      };
    };
  };

  // Login a user
  public func login(email: Text, password: Text): async Result.Result<Session, Text> {
    switch (users.get(email)) {
      case (?user) {
        let inputHash = hashPassword(password);
        
        if (Text.equal(inputHash, user.passwordHash)) {
          // Update last login time
          let now = Time.now();
          let updatedUser: User = {
            email = user.email;
            passwordHash = user.passwordHash;
            createdAt = user.createdAt;
            lastLogin = ?now;
          };
          users.put(email, updatedUser);
          
          // Create a new session
          let token = generateToken(email);
          let expiresAt = now + 7 * 24 * 60 * 60 * 1000000000; // 7 days in nanoseconds
          
          let session: Session = {
            userId = email;
            token = token;
            expiresAt = expiresAt;
          };
          
          sessions.put(token, session);
          
          return #ok(session);
        } else {
          return #err("Invalid password");
        };
      };
      case null {
        return #err("User not found");
      };
    };
  };

  // Validate a session token
  public query func validateSession(token: Text): async Bool {
    switch (sessions.get(token)) {
      case (?session) {
        let now = Time.now();
        now < session.expiresAt
      };
      case null {
        false
      };
    };
  };

  // Get user profile by token
  public query func getUserProfile(token: Text): async Result.Result<UserProfile, Text> {
    switch (sessions.get(token)) {
      case (?session) {
        let now = Time.now();
        if (now < session.expiresAt) {
          switch (users.get(session.userId)) {
            case (?user) {
              let profile: UserProfile = {
                email = user.email;
                createdAt = user.createdAt;
              };
              return #ok(profile);
            };
            case null {
              return #err("User not found");
            };
          };
        } else {
          return #err("Session expired");
        };
      };
      case null {
        return #err("Invalid session");
      };
    };
  };

  // Logout a user
  public func logout(token: Text): async Bool {
    switch (sessions.get(token)) {
      case (?_) {
        sessions.delete(token);
        true
      };
      case null {
        false
      };
    };
  };
}
