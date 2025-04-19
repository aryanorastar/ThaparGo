import * as ethers from 'ethers';
import SocietyFactoryArtifact from '../artifacts/contracts/SocietyFactory.sol/SocietyFactory.json';

// This will be populated after contract deployment
const SOCIETY_FACTORY_ADDRESS = import.meta.env.VITE_SOCIETY_FACTORY_ADDRESS || '';

// Types from the contract
export interface Society {
  name;
  description: ;
  imageURI;
  creator;
  createdAt;
  isActive;
}

export interface Event {
  societyId;
  name;
  description: ;
  imageURI;
  startTime;
  endTime;
  createdAt;
  isActive;
}

export interface Participant {
  userAddress;
  joinedAt;
}

class ContractService {
  private contract = null;
  
  constructor() {
    this.initializeContract = this.initializeContract.bind(this);
  }
  
  async initializeContract(signer) {
    try {
      this.contract = new ethers.Contract(
        SOCIETY_FACTORY_ADDRESS,
        SocietyFactoryArtifact.abi,
        signer
      );
      return true;
    } catch (error) {
      console.error('Error initializing contract:', error);
      return false;
    }
  }
  
  // Society functions
  async createSociety(name, description: , imageURI) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.createSociety(name, description: , imageURI);
    const receipt = await tx.wait();
    
    // Find the SocietyCreated event in the receipt
    const event = receipt.logs
      .map((log) => {
        try {
          return this.contract?.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((event) => event && event.name === 'SocietyCreated');
    
    return event ? event.args.societyId ;
  }
  
  async updateSociety(societyId, name, description: , imageURI) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.updateSociety(societyId, name, description: , imageURI);
    await tx.wait();
    return true;
  }
  
  async toggleSocietyStatus(societyId) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.toggleSocietyStatus(societyId);
    await tx.wait();
    return true;
  }
  
  // Event functions
  async createEvent(
    societyId,
    name,
    description: ,
    imageURI,
    startTime,
    endTime
  ) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.createEvent(
      societyId,
      name,
      description: ,
      imageURI,
      startTime,
      endTime
    );
    const receipt = await tx.wait();
    
    // Find the EventCreated event in the receipt
    const event = receipt.logs
      .map((log) => {
        try {
          return this.contract?.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((event) => event && event.name === 'EventCreated');
    
    return event ? event.args.eventId ;
  }
  
  async updateEvent(
    societyId,
    eventId,
    name,
    description: ,
    imageURI,
    startTime,
    endTime
  ) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.updateEvent(
      societyId,
      eventId,
      name,
      description: ,
      imageURI,
      startTime,
      endTime
    );
    await tx.wait();
    return true;
  }
  
  async toggleEventStatus(societyId, eventId) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.toggleEventStatus(societyId, eventId);
    await tx.wait();
    return true;
  }
  
  // Participant functions
  async joinEvent(societyId, eventId) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.joinEvent(societyId, eventId);
    await tx.wait();
    return true;
  }
  
  // View functions
  async getAllSocieties()<Society[]> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const societies = await this.contract.getAllSocieties();
    return societies.map((society) => ({
      name.name,
      description: .description: ,
      imageURI.imageURI,
      creator.creator,
      createdAt(society.createdAt),
      isActive.isActive
    }));
  }
  
  async getSocietyEvents(societyId)<Event[]> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const events = await this.contract.getSocietyEvents(societyId);
    return events.map((event) => ({
      societyId(event.societyId),
      name.name,
      description: .description: ,
      imageURI.imageURI,
      startTime(event.startTime),
      endTime(event.endTime),
      createdAt(event.createdAt),
      isActive.isActive
    }));
  }
  
  async getParticipants(societyId, eventId)<Participant[]> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const participants = await this.contract.getParticipants(societyId, eventId);
    return participants.map((participant) => ({
      userAddress.userAddress,
      joinedAt(participant.joinedAt)
    }));
  }
  
  async getParticipantCount(societyId, eventId) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const count = await this.contract.getParticipantCount(societyId, eventId);
    return Number(count);
  }
  
  async isUserParticipant(societyId, eventId, userAddress) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return this.contract.isUserParticipant(societyId, eventId, userAddress);
  }
  
  async isAdmin(address) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return this.contract.admins(address);
  }
}

// Singleton instance
export const contractService = new ContractService();
export default contractService;
