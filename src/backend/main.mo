import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

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

  // Initialize societies storage
  private var nextId : Nat = 1;
  private let societies = HashMap.HashMap<Text, SocietyWithSocial>(0, Text.equal, Text.hash);

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
}
