import * as ethers from 'ethers';
import SocietyFactoryArtifact from '../artifacts/contracts/SocietyFactory.sol/SocietyFactory.json';

// This will be populated after contract deployment
const SOCIETY_FACTORY_ADDRESS = import.meta.env.VITE_SOCIETY_FACTORY_ADDRESS || '';

// Types from the contract
export interface Society {
  name: string;
  description: string;
  imageURI: string;
  creator: string;
  createdAt: number;
  isActive: boolean;
}

export interface Event {
  societyId: number;
  name: string;
  description: string;
  imageURI: string;
  startTime: number;
  endTime: number;
  createdAt: number;
  isActive: boolean;
}

export interface Participant {
  userAddress: string;
  joinedAt: number;
}

class ContractService {
  private contract: any = null;
  
  constructor() {
    this.initializeContract = this.initializeContract.bind(this);
  }
  
  async initializeContract(signer: any) {
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
  async createSociety(name: string, description: string, imageURI: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.createSociety(name, description, imageURI);
    const receipt = await tx.wait();
    
    // Find the SocietyCreated event in the receipt
    const event = receipt.logs
      .map((log: any) => {
        try {
          return this.contract?.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((event: any) => event && event.name === 'SocietyCreated');
    
    return event ? event.args.societyId : null;
  }
  
  async updateSociety(societyId: number, name: string, description: string, imageURI: string) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.updateSociety(societyId, name, description, imageURI);
    await tx.wait();
    return true;
  }
  
  async toggleSocietyStatus(societyId: number) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.toggleSocietyStatus(societyId);
    await tx.wait();
    return true;
  }
  
  // Event functions
  async createEvent(
    societyId: number,
    name: string,
    description: string,
    imageURI: string,
    startTime: number,
    endTime: number
  ) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.createEvent(
      societyId,
      name,
      description,
      imageURI,
      startTime,
      endTime
    );
    const receipt = await tx.wait();
    
    // Find the EventCreated event in the receipt
    const event = receipt.logs
      .map((log: any) => {
        try {
          return this.contract?.interface.parseLog(log);
        } catch (e) {
          return null;
        }
      })
      .find((event: any) => event && event.name === 'EventCreated');
    
    return event ? event.args.eventId : null;
  }
  
  async updateEvent(
    societyId: number,
    eventId: number,
    name: string,
    description: string,
    imageURI: string,
    startTime: number,
    endTime: number
  ) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.updateEvent(
      societyId,
      eventId,
      name,
      description,
      imageURI,
      startTime,
      endTime
    );
    await tx.wait();
    return true;
  }
  
  async toggleEventStatus(societyId: number, eventId: number) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.toggleEventStatus(societyId, eventId);
    await tx.wait();
    return true;
  }
  
  // Participant functions
  async joinEvent(societyId: number, eventId: number) {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const tx = await this.contract.joinEvent(societyId, eventId);
    await tx.wait();
    return true;
  }
  
  // View functions
  async getAllSocieties(): Promise<Society[]> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const societies = await this.contract.getAllSocieties();
    return societies.map((society: any) => ({
      name: society.name,
      description: society.description,
      imageURI: society.imageURI,
      creator: society.creator,
      createdAt: Number(society.createdAt),
      isActive: society.isActive
    }));
  }
  
  async getSocietyEvents(societyId: number): Promise<Event[]> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const events = await this.contract.getSocietyEvents(societyId);
    return events.map((event: any) => ({
      societyId: Number(event.societyId),
      name: event.name,
      description: event.description,
      imageURI: event.imageURI,
      startTime: Number(event.startTime),
      endTime: Number(event.endTime),
      createdAt: Number(event.createdAt),
      isActive: event.isActive
    }));
  }
  
  async getParticipants(societyId: number, eventId: number): Promise<Participant[]> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const participants = await this.contract.getParticipants(societyId, eventId);
    return participants.map((participant: any) => ({
      userAddress: participant.userAddress,
      joinedAt: Number(participant.joinedAt)
    }));
  }
  
  async getParticipantCount(societyId: number, eventId: number): Promise<number> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    const count = await this.contract.getParticipantCount(societyId, eventId);
    return Number(count);
  }
  
  async isUserParticipant(societyId: number, eventId: number, userAddress: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return this.contract.isUserParticipant(societyId, eventId, userAddress);
  }
  
  async isAdmin(address: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized');
    
    return this.contract.admins(address);
  }
}

// Singleton instance
export const contractService = new ContractService();
export default contractService;
