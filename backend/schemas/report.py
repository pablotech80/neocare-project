from pydantic import BaseModel, Field
from typing import Optional

class WeeklySummaryResponse(BaseModel):
    """Schema for weekly summary report"""
    week: str = Field(..., description="Week in ISO format (YYYY-WW)")
    completed: int = Field(..., description="Number of completed cards in the week")
    overdue: int = Field(..., description="Number of overdue cards in the week")
    new: int = Field(..., description="Number of new cards created in the week")

class HoursByUserResponse(BaseModel):
    """Schema for hours by user report"""
    user_id: int = Field(..., description="User ID")
    username: str = Field(..., description="Username")
    total_hours: float = Field(..., description="Total hours worked")
    tasks_count: int = Field(..., description="Number of distinct tasks worked on")

class HoursByUserReport(BaseModel):
    """Schema for hours by user report list"""
    week: str = Field(..., description="Week in ISO format (YYYY-WW)")
    users: list[HoursByUserResponse] = Field(..., description="List of users with their hours")

class HoursByCardResponse(BaseModel):
    """Schema for hours by card report"""
    card_id: int = Field(..., description="Card ID")
    title: str = Field(..., description="Card title")
    total_hours: float = Field(..., description="Total hours worked on this card")
    responsible: Optional[str] = Field(None, description="Responsible user (if assigned)")
    estado: str = Field(..., description="Card status")

class HoursByCardReport(BaseModel):
    """Schema for hours by card report list"""
    week: str = Field(..., description="Week in ISO format (YYYY-WW)")
    cards: list[HoursByCardResponse] = Field(..., description="List of cards with their hours")
